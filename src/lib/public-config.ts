/**
 * Browser-safe configuration. Everything here is PUBLIC and is inlined into the
 * client bundle at `next build` time (that is what the NEXT_PUBLIC_ prefix means),
 * so none of these may ever hold a secret, and changing them requires a rebuild.
 *
 * Each variable must be read with a literal `process.env.NEXT_PUBLIC_X` expression
 * so Next can inline it.
 *
 * In production a missing value is a hard error rather than a silent localhost
 * default — a misconfigured deploy must fail loudly, not quietly render the wrong thing.
 */

export const IS_PRODUCTION = process.env.NODE_ENV === "production";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

function requireInProduction(name: string, value: string | undefined, developmentDefault: string): string {
  const trimmed = value?.trim();
  if (trimmed) return trimmed;
  if (!IS_PRODUCTION) return developmentDefault;
  throw new Error(
    `${name} is required in production but is not set. It is a build-time variable: pass it as a ` +
      `build argument / set it before \`next build\` (see .env.example and DEPLOYMENT.md).`
  );
}

function requireUrl(name: string, value: string | undefined, developmentDefault: string): string {
  const raw = requireInProduction(name, value, developmentDefault);
  try {
    new URL(raw);
  } catch {
    throw new Error(`${name} must be an absolute URL such as https://example.com (got "${raw}").`);
  }
  return stripTrailingSlash(raw);
}

/** Public base URL of the CMS. Used for browser-facing media URLs, never for API calls. */
export const CMS_PUBLIC_URL = requireUrl(
  "NEXT_PUBLIC_CMS_PUBLIC_URL",
  process.env.NEXT_PUBLIC_CMS_PUBLIC_URL,
  "http://localhost:1337"
);

/** Public base URL of this website (metadataBase, canonical/OG URLs). */
export const WEB_URL = requireUrl("NEXT_PUBLIC_WEB_URL", process.env.NEXT_PUBLIC_WEB_URL, "http://localhost:3000");

const EMAIL_PATTERN = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/;

function requireEmail(name: string, value: string | undefined, developmentDefault: string): string {
  const email = requireInProduction(name, value, developmentDefault);
  if (!EMAIL_PATTERN.test(email)) {
    throw new Error(`${name} must be a valid email address (got "${email}").`);
  }
  return email;
}

/** Address that contact / booking-request emails are sent to. */
export const CONTACT_EMAIL = requireEmail(
  "NEXT_PUBLIC_CONTACT_EMAIL",
  process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  "contact@example.com"
);

/** Optional Fullscript dispensary link shown on /shop. */
export const FULLSCRIPT_URL: string | undefined = process.env.NEXT_PUBLIC_FULLSCRIPT_URL?.trim() || undefined;
