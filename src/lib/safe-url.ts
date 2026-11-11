/**
 * Validation for every admin-controlled URL that ends up in an href, iframe or video tag.
 * Browser-safe and side-effect free; used both when rendering (so bad stored data can't
 * execute) and when saving in the admin (so bad input is rejected with a clear message).
 */

import { CMS_PUBLIC_URL } from "./public-config";
import { toRelativeMediaPath } from "./cms-media";

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

/**
 * Returns the link if it is safe to render as an href, otherwise undefined.
 *
 * Allowed:  site-relative paths ("/booking", "/blog?x=1"), in-page anchors ("#services"),
 *           https:// links, mailto: and tel:.
 * Rejected: javascript:, data:, file:, vbscript:, http:, protocol-relative ("//host"),
 *           backslash tricks, control characters, and bare strings with no scheme or slash.
 */
export function safeHref(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const href = value.trim();
  if (!href || href.length > 2048 || CONTROL_CHARS.test(href)) return undefined;

  if (href.startsWith("#") || href.startsWith("?")) return href;

  if (href.startsWith("/")) {
    if (href.startsWith("//") || href.startsWith("/\\")) return undefined;
    return href;
  }

  try {
    const url = new URL(href);
    if (url.protocol === "https:" || url.protocol === "mailto:" || url.protocol === "tel:") return href;
  } catch {
    // not an absolute URL
  }
  return undefined;
}

export function isSafeHref(value: string | null | undefined): boolean {
  return safeHref(value) !== undefined;
}

/** True for links that leave the site (rendered with a plain <a> instead of next/link). */
export function isExternalHref(href: string): boolean {
  return !href.startsWith("/") && !href.startsWith("#") && !href.startsWith("?");
}

// ---------- video ----------

export type ParsedVideo =
  | { kind: "youtube"; src: string }
  | { kind: "vimeo"; src: string }
  | { kind: "file"; src: string };

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);
const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const VIDEO_FILE = /\.(mp4|webm|ogg|mov|m4v)$/i;

/**
 * Accepts ONLY:
 *   - YouTube (watch / youtu.be / embed / shorts / live) and Vimeo https:// links, and
 *   - video files uploaded to this site's own CMS (/uploads/...).
 * Everything else — arbitrary hosts, http:, javascript:, data:, external .mp4 links —
 * returns null. The returned `src` is rebuilt from a validated ID, never echoed from input.
 */
export function parseVideoUrl(raw: string | null | undefined): ParsedVideo | null {
  const value = raw?.trim();
  if (!value || value.length > 2048 || CONTROL_CHARS.test(value)) return null;

  const relative = toRelativeMediaPath(value);
  if (relative) {
    const pathOnly = relative.split(/[?#]/)[0];
    return VIDEO_FILE.test(pathOnly) ? { kind: "file", src: `${CMS_PUBLIC_URL}${relative}` } : null;
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;

  const host = url.hostname.toLowerCase();

  if (host === "youtu.be") {
    const id = url.pathname.split("/")[1];
    return id && YOUTUBE_ID.test(id) ? { kind: "youtube", src: `https://www.youtube.com/embed/${id}` } : null;
  }

  if (YOUTUBE_HOSTS.has(host)) {
    let id: string | null | undefined = null;
    if (url.pathname === "/watch") id = url.searchParams.get("v");
    else id = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/)?.[1];
    return id && YOUTUBE_ID.test(id) ? { kind: "youtube", src: `https://www.youtube.com/embed/${id}` } : null;
  }

  if (VIMEO_HOSTS.has(host)) {
    const match = url.pathname.match(/^\/(?:video\/)?(\d{1,12})(?:\/([0-9a-f]{6,32}))?\/?$/i);
    if (!match) return null;
    const hash = match[2] ?? url.searchParams.get("h");
    const suffix = hash && /^[0-9a-f]{6,32}$/i.test(hash) ? `?h=${hash}` : "";
    return { kind: "vimeo", src: `https://player.vimeo.com/video/${match[1]}${suffix}` };
  }

  return null;
}

export const VIDEO_URL_HELP =
  "Use a YouTube or Vimeo https:// link, or upload a video file.";
export const LINK_HELP =
  "Use a site path like /booking, an https:// link, a mailto: or tel: link, or an #anchor.";
