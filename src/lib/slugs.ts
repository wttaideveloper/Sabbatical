/**
 * URL slugs for admin-created pages (served by the catch-all src/app/[slug]/page.tsx).
 * Shared by the admin save action (to reject bad slugs) and the public route (to avoid
 * hitting the CMS for obviously invalid paths such as /wp-login.php or /.env).
 */

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const MAX_SLUG_LENGTH = 80;

/** Every existing static route, plus a few conventional reservations. */
export const RESERVED_SLUGS: ReadonlySet<string> = new Set([
  "",
  "admin",
  "api",
  "home",
  "about",
  "blog",
  "booking",
  "contact",
  "educational-consults",
  "faq",
  "group-sessions",
  "resources",
  "shop",
  "speaking-retreats",
  "videos",
  "robots",
  "sitemap",
]);

/** Shape check only (no CMS lookup): lowercase letters, digits and single hyphens. */
export function isWellFormedSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= MAX_SLUG_LENGTH && SLUG_PATTERN.test(slug);
}

/** Well-formed AND not reserved — the only slugs worth asking the CMS about. */
export function isLookupableSlug(slug: string): boolean {
  return isWellFormedSlug(slug) && !RESERVED_SLUGS.has(slug);
}
