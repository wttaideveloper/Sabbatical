/**
 * Browser-safe helpers for CMS media. Importable from client AND server components.
 * Contains no secrets and no server-only API access (see strapi.ts / strapi-admin.ts).
 *
 * Media references are stored in Strapi as RELATIVE paths ("/uploads/x.png") so the
 * database never contains an internal Docker hostname or a hard-coded domain. They are
 * turned into absolute, browser-facing URLs only at render time, using the public CMS URL.
 */

import { CMS_PUBLIC_URL } from "./public-config";

export type StrapiMedia = {
  id: number;
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
};

/** Hosts whose /uploads/ URLs are known to be our own CMS (legacy dev data, internal Docker name). */
const OWN_CMS_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]", "cms"]);

const CMS_PUBLIC_HOST: string | null = (() => {
  try {
    return new URL(CMS_PUBLIC_URL).host;
  } catch {
    return null;
  }
})();

/**
 * Returns "/uploads/..." when `url` points at this project's CMS media — whether it is
 * already relative, a legacy `http://localhost:1337/uploads/...` URL saved during local
 * development, an internal Docker URL, or the public CMS URL. Returns null for anything else.
 */
export function toRelativeMediaPath(url: string | null | undefined): string | null {
  if (!url) return null;
  const value = url.trim();
  if (!value) return null;

  if (value.startsWith("/uploads/")) {
    return value.split(/[?#]/)[0].split("/").includes("..") ? null : value;
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  if (!parsed.pathname.startsWith("/uploads/")) return null;

  const isOwnHost = OWN_CMS_HOSTNAMES.has(parsed.hostname) || parsed.host === CMS_PUBLIC_HOST;
  return isOwnHost ? `${parsed.pathname}${parsed.search}` : null;
}

/**
 * Browser-facing absolute URL for a stored media reference.
 *   - CMS media (relative or legacy-absolute)  -> `${NEXT_PUBLIC_CMS_PUBLIC_URL}/uploads/...`
 *   - any other https URL                       -> unchanged
 *   - anything else (http:, javascript:, ...)   -> undefined
 */
export function mediaUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;

  const relative = toRelativeMediaPath(url);
  if (relative) return `${CMS_PUBLIC_URL}${relative}`;

  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "https:" ? parsed.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function strapiImageUrl(media?: StrapiMedia | null): string | undefined {
  return mediaUrl(media?.url);
}

/** Splits a plain-text/markdown-ish richtext field on blank lines into paragraphs. */
export function toParagraphs(text?: string): string[] {
  if (!text) return [];
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
