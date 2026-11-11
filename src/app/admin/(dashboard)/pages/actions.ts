"use server";

import { assertAdmin } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCollectionEntry,
  deleteCollectionEntry,
  getCollectionEntryForEdit,
  listCollectionForEdit,
  updateCollectionEntry,
  publishDocument,
  resolveMediaRelation,
} from "@/lib/strapi-admin";
import { parseCustomSectionsField, str } from "@/lib/admin-form";
import { RESERVED_SLUGS, isWellFormedSlug } from "@/lib/slugs";
import type { DynamicPage } from "@/lib/strapi";

const UID = "dynamic-pages";

export async function loadPages() {
  await assertAdmin();
  return listCollectionForEdit<DynamicPage>(UID, "title:asc");
}

export async function loadPage(documentId: string) {
  await assertAdmin();
  if (documentId === "new") return { data: null, error: null };
  return getCollectionEntryForEdit<DynamicPage>(UID, documentId);
}

export async function savePage(documentId: string, mode: "draft" | "publish", formData: FormData) {
  await assertAdmin();
  const slug = (str(formData, "slug") || "").toLowerCase();

  if (!slug) {
    redirect(`/admin/pages/${documentId}?error=${encodeURIComponent("A URL is required.")}`);
  }
  if (!isWellFormedSlug(slug)) {
    redirect(
      `/admin/pages/${documentId}?error=${encodeURIComponent(
        "URL can only contain lowercase letters, numbers, and hyphens (e.g. my-page-name)."
      )}`
    );
  }
  if (RESERVED_SLUGS.has(slug)) {
    redirect(
      `/admin/pages/${documentId}?error=${encodeURIComponent(
        `"${slug}" is already used by an existing page — choose a different URL.`
      )}`
    );
  }

  let heroImageId: number | undefined;
  let sections: Record<string, unknown>[];

  try {
    heroImageId = await resolveMediaRelation(formData, "heroImage");
    const rows = parseCustomSectionsField(formData, "sections");
    sections = await Promise.all(
      rows.map(async (row) => ({
        blockType: row.blockType,
        heading: row.heading,
        body: row.body,
        backgroundColor: row.backgroundColor,
        textColor: row.textColor,
        fontFamily: row.fontFamily,
        layout: row.layout,
        ctaLabel: row.ctaLabel,
        ctaHref: row.ctaHref,
        attribution: row.attribution,
        videoUrl: row.videoUrl,
        image: await resolveMediaRelation(formData, `sections__${row.index}__image`),
      }))
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    redirect(`/admin/pages/${documentId}?error=${encodeURIComponent(message)}`);
  }

  const payload: Record<string, unknown> = {
    title: str(formData, "title"),
    slug,
    seoDescription: str(formData, "seoDescription"),
    heroEyebrow: str(formData, "heroEyebrow"),
    heroTitle: str(formData, "heroTitle"),
    heroLead: str(formData, "heroLead"),
    heroBackgroundColor: str(formData, "heroBackgroundColor"),
    heroTextColor: str(formData, "heroTextColor"),
    heroFontFamily: str(formData, "heroFontFamily"),
    sections,
  };
  if (heroImageId) payload.heroImage = heroImageId;

  const result =
    documentId === "new"
      ? await createCollectionEntry<DynamicPage & { documentId: string }>(UID, payload, { status: "draft" })
      : await updateCollectionEntry<DynamicPage & { documentId: string }>(UID, documentId, payload, {
          status: "draft",
        });

  if (result.error) {
    redirect(`/admin/pages/${documentId}?error=${encodeURIComponent(result.error)}`);
  }

  if (mode === "publish" && result.data) {
    const published = await publishDocument(UID, result.data.documentId);
    if (published.error) {
      redirect(`/admin/pages/${result.data.documentId}?error=${encodeURIComponent(published.error)}`);
    }
  }

  revalidatePath(`/${slug}`);
  revalidatePath("/admin/pages");
  // Stay on the editor (not the list) — building out a whole page's hero +
  // sections is iterative, unlike a quick blog/product edit, so bouncing to
  // the list after every draft save would be disruptive. A brand-new page's
  // "new" segment is swapped for its real documentId once one exists.
  const targetId = documentId === "new" && result.data ? result.data.documentId : documentId;
  redirect(`/admin/pages/${targetId}?status=${mode === "publish" ? "published" : "draft"}`);
}

export async function deletePage(documentId: string) {
  await assertAdmin();
  // Fetch the slug before deleting — once the entry is gone there's no way to
  // know which ISR-cached path needs invalidating, and without this the
  // deleted page keeps serving its last cached render for up to 60s.
  const { data: page } = await getCollectionEntryForEdit<DynamicPage>(UID, documentId);

  const result = await deleteCollectionEntry(UID, documentId);
  if (result.error) {
    redirect(`/admin/pages?error=${encodeURIComponent(result.error)}`);
  }

  if (page?.slug) revalidatePath(`/${page.slug}`);
  redirect("/admin/pages?status=deleted");
}
