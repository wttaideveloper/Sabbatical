import "server-only";

/**
 * Base URL for SERVER-TO-SERVER requests from Next.js to Strapi.
 *
 * In Docker this is the internal service address (http://cms:1337) — never the public
 * CMS domain, and never used to build anything a browser sees (see lib/cms-media.ts for
 * the public side). It is a runtime variable, not NEXT_PUBLIC_*.
 *
 * Production has no localhost fallback: inside a container "localhost" is the container
 * itself, which would silently break every CMS request. A missing value throws.
 */
export function getStrapiInternalUrl(): string {
  const configured = process.env.STRAPI_INTERNAL_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  if (process.env.NODE_ENV !== "production") return "http://localhost:1337";

  throw new Error(
    "STRAPI_INTERNAL_URL is not set. In Docker it must be http://cms:1337 (see docker-compose.yml)."
  );
}
