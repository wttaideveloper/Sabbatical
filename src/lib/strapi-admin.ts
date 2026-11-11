import "server-only";

import { getStrapiInternalUrl } from "./strapi-server";
import { toRelativeMediaPath } from "./cms-media";
import { parseVideoUrl, VIDEO_URL_HELP } from "./safe-url";

export type AdminResult<T> = { data: T | null; error: string | null };

/** Matches the 20 MB limits configured in next.config.ts, nginx and Strapi. */
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
/** Strapi's configured maxLimit (cms/config/api.ts) — page size must never exceed it. */
const MAX_PAGE_SIZE = 100;
const MAX_PAGES = 50;

export function isStrapiTokenConfigured(): boolean {
  return Boolean(process.env.STRAPI_API_TOKEN);
}

export const NOT_CONFIGURED_ERROR =
  "STRAPI_API_TOKEN is not set. Create an API token in the Strapi admin (Settings → API Tokens → Create new API Token) and add it to the frontend environment (.env.local in development, the server's .env file in production), then restart the app.";

/**
 * Published reads work without a token, since Strapi's Public role allows
 * find/findOne. Draft reads and all mutations require STRAPI_API_TOKEN — Strapi's
 * `status` query param isn't a separate permission scope, so a Strapi-side
 * middleware (cms/src/middlewares/block-public-draft-reads.ts) rejects unauthenticated
 * `status=draft` requests; the token is required here to match. requireToken lets
 * these helpers fail fast with a clear message instead of a confusing 401/403.
 */
async function strapiAdminFetch<T>(
  path: string,
  init?: RequestInit,
  requireToken = false
): Promise<AdminResult<T>> {
  const token = process.env.STRAPI_API_TOKEN;
  if (requireToken && !token) {
    return { data: null, error: NOT_CONFIGURED_ERROR };
  }

  try {
    const isFormData = init?.body instanceof FormData;
    const res = await fetch(`${getStrapiInternalUrl()}/api/${path}`, {
      ...init,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...init?.headers,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(isFormData ? 120_000 : 20_000),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        json?.error?.message ||
        (Array.isArray(json?.error?.details?.errors)
          ? json.error.details.errors.map((e: { message: string }) => e.message).join("; ")
          : null) ||
        `Strapi responded with ${res.status}`;
      return { data: null, error: message };
    }

    return { data: (json?.data ?? json) as T, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Network error reaching Strapi" };
  }
}

export type StatusOpt = { status?: "draft" | "published" };

function statusQS(opts?: StatusOpt): string {
  return `status=${opts?.status ?? "draft"}`;
}

// Every write call site in this app is being migrated to draft-first as part of
// the admin's draft/publish workflow, so status defaults to "draft" everywhere —
// a call site that forgets to pass a status fails toward "didn't go live" rather
// than "silently republished."

export function getSingleType<T>(uid: string, opts: StatusOpt = {}) {
  const status = opts.status ?? "draft";
  return strapiAdminFetch<T>(`${uid}?populate=*&${statusQS(opts)}`, undefined, status === "draft");
}

export function updateSingleType<T>(uid: string, data: Record<string, unknown>, opts: StatusOpt = {}) {
  return strapiAdminFetch<T>(`${uid}?${statusQS(opts)}`, { method: "PUT", body: JSON.stringify({ data }) }, true);
}

/**
 * Fetches every entry of a collection, paging in chunks of MAX_PAGE_SIZE. Strapi clamps
 * any larger pageSize to its configured maxLimit (100), which used to silently truncate
 * this list; paging keeps the full set while respecting that limit.
 */
export async function listCollection<T>(
  uid: string,
  sort = "order:asc",
  opts: StatusOpt = {}
): Promise<AdminResult<T[]>> {
  const status = opts.status ?? "draft";
  const all: T[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const result = await strapiAdminFetch<T[]>(
      `${uid}?populate=*&sort=${encodeURIComponent(sort)}&pagination[page]=${page}&pagination[pageSize]=${MAX_PAGE_SIZE}&${statusQS(opts)}`,
      undefined,
      status === "draft"
    );
    if (result.error) return { data: null, error: result.error };

    const batch = result.data ?? [];
    all.push(...batch);
    if (batch.length < MAX_PAGE_SIZE) break;
  }

  return { data: all, error: null };
}

export function getCollectionEntry<T>(uid: string, documentId: string, opts: StatusOpt = {}) {
  const status = opts.status ?? "draft";
  return strapiAdminFetch<T>(`${uid}/${documentId}?populate=*&${statusQS(opts)}`, undefined, status === "draft");
}

export function createCollectionEntry<T>(uid: string, data: Record<string, unknown>, opts: StatusOpt = {}) {
  return strapiAdminFetch<T>(`${uid}?${statusQS(opts)}`, { method: "POST", body: JSON.stringify({ data }) }, true);
}

export function updateCollectionEntry<T>(
  uid: string,
  documentId: string,
  data: Record<string, unknown>,
  opts: StatusOpt = {}
) {
  return strapiAdminFetch<T>(
    `${uid}/${documentId}?${statusQS(opts)}`,
    { method: "PUT", body: JSON.stringify({ data }) },
    true
  );
}

export function deleteCollectionEntry(uid: string, documentId: string) {
  return strapiAdminFetch<unknown>(`${uid}/${documentId}`, { method: "DELETE" }, true);
}

/**
 * Falls back to the published version if no draft row exists yet. Needed because
 * every entry that existed before this feature has ONLY a published row (drafts
 * didn't functionally exist before) — without this fallback, the first time an
 * admin opens an edit screen post-migration the form would come back empty.
 */
export async function getSingleTypeForEdit<T>(uid: string): Promise<AdminResult<T>> {
  const draft = await getSingleType<T>(uid, { status: "draft" });
  if (draft.data) return draft;
  return getSingleType<T>(uid, { status: "published" });
}

export async function getCollectionEntryForEdit<T>(uid: string, documentId: string): Promise<AdminResult<T>> {
  const draft = await getCollectionEntry<T>(uid, documentId, { status: "draft" });
  if (draft.data) return draft;
  return getCollectionEntry<T>(uid, documentId, { status: "published" });
}

/**
 * Promotes the current draft to published. Strapi's public REST API has no
 * publish/unpublish action (only `strapi.documents(uid).publish()`, callable only
 * from code running inside Strapi) — this hits the small custom route that bridges
 * that gap (cms/src/api/publish).
 */
export function publishDocument<T>(uid: string, documentId: string) {
  return strapiAdminFetch<{ documentId: string; entry: T }>(
    "publish",
    { method: "POST", body: JSON.stringify({ uid, documentId }) },
    true
  );
}

/**
 * Merges draft and published rows by documentId for a collection list, draft
 * winning when both exist. Solves two gaps a plain draft-only or published-only
 * list would each have: existing entries have only a published row until
 * re-saved (a draft-only list would show nothing), and a brand-new entry an
 * admin just created but hasn't published yet has only a draft row (a
 * published-only list would hide it as if it vanished).
 */
export async function listCollectionForEdit<T extends { documentId: string }>(
  uid: string,
  sort = "order:asc"
): Promise<AdminResult<T[]>> {
  const [draft, published] = await Promise.all([
    listCollection<T>(uid, sort, { status: "draft" }),
    listCollection<T>(uid, sort, { status: "published" }),
  ]);
  if (draft.error && published.error) {
    return { data: null, error: draft.error };
  }

  const byId = new Map<string, T>();
  for (const item of published.data ?? []) byId.set(item.documentId, item);
  for (const item of draft.data ?? []) byId.set(item.documentId, item);

  const [field, direction] = sort.split(":");
  const merged = Array.from(byId.values()).sort((a, b) => {
    const av = (a as Record<string, unknown>)[field];
    const bv = (b as Record<string, unknown>)[field];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return direction === "desc" ? -cmp : cmp;
  });

  return { data: merged, error: null };
}

export type PublishStatus = { hasDraft: boolean; hasPublished: boolean; dirty: boolean };

/** Cheap updatedAt-only check powering the dashboard's "pending changes" indicator. */
export async function getPublishStatus(uid: string, documentId?: string): Promise<PublishStatus> {
  const base = documentId ? `${uid}/${documentId}` : uid;
  const [draft, published] = await Promise.all([
    strapiAdminFetch<{ updatedAt?: string }>(`${base}?fields[0]=updatedAt&status=draft`, undefined, true),
    strapiAdminFetch<{ updatedAt?: string }>(`${base}?fields[0]=updatedAt&status=published`),
  ]);
  const hasDraft = Boolean(draft.data);
  const hasPublished = Boolean(published.data);
  const dirty =
    hasDraft &&
    (!hasPublished ||
      !published.data?.updatedAt ||
      !draft.data?.updatedAt ||
      new Date(draft.data.updatedAt) > new Date(published.data.updatedAt));
  return { hasDraft, hasPublished, dirty };
}

export async function uploadMedia(file: File): Promise<AdminResult<{ id: number; url: string }>> {
  if (file.size > MAX_UPLOAD_BYTES) {
    return { data: null, error: `That file is too large. The limit is ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB.` };
  }
  // Strapi enforces its own allow-list as well; this just gives a clear message early.
  if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
    return { data: null, error: "Only image and video files can be uploaded here." };
  }

  const form = new FormData();
  form.append("files", file);
  const result = await strapiAdminFetch<{ id: number; url: string }[]>(
    "upload",
    { method: "POST", body: form },
    true
  );
  if (result.error || !result.data) {
    return { data: null, error: result.error };
  }
  return { data: result.data[0] ?? null, error: null };
}

/**
 * For Strapi media-relation fields (e.g. `image`, `heroPhoto`, `logo`). Only a file
 * uploaded through the form is accepted.
 *
 * Fetching an admin-supplied URL server-side (the old "paste a link" feature) was
 * removed on purpose: it let the admin panel make the server request arbitrary
 * addresses, including internal Docker services and other projects on the VPS (SSRF).
 * Nothing in this app fetches a URL the user typed.
 */
export async function resolveMediaRelation(formData: FormData, field: string): Promise<number | undefined> {
  const file = formData.get(field);
  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadMedia(file);
    if (uploaded.error) throw new Error(uploaded.error);
    return uploaded.data?.id;
  }
  return undefined;
}

/**
 * For plain-string video URL fields (e.g. a hero video).
 *   - An uploaded file is hosted in Strapi and stored as its RELATIVE path (`/uploads/x.mp4`),
 *     so the database never contains an internal Docker hostname or a hard-coded domain.
 *   - A typed link is never fetched. It is accepted only if it is a YouTube/Vimeo https://
 *     link or already points at this CMS’s own uploads (legacy localhost URLs are
 *     normalised to relative paths). Anything else is rejected with a clear message.
 */
export async function resolveMediaUrl(formData: FormData, field: string): Promise<string | undefined> {
  const file = formData.get(field);
  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadMedia(file);
    if (uploaded.error) throw new Error(uploaded.error);
    if (!uploaded.data) return undefined;
    return toRelativeMediaPath(uploaded.data.url) ?? uploaded.data.url;
  }

  const link = formData.get(`${field}Link`);
  if (typeof link === "string" && link.trim()) {
    const value = link.trim();
    const relative = toRelativeMediaPath(value);
    if (relative) return relative;
    if (!parseVideoUrl(value)) {
      throw new Error(`That video link isn’t supported. ${VIDEO_URL_HELP}`);
    }
    return value;
  }

  return undefined;
}
