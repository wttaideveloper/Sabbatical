/**
 * Strapi's `status` query param (draft vs published) is just a validated request
 * parameter, not a separate permission scope: the Public role's `find`/`findOne` grant
 * would let an unauthenticated caller read DRAFT content simply by appending
 * `?status=draft` to any content-API URL. The admin panel relies on real draft state
 * (edits stay unpublished until "Publish Live"), so that would leak unpublished content.
 *
 * This middleware requires a bearer token for any content-API request that asks for
 * anything other than published content. It is intentionally strict:
 *   - the path match is case-insensitive, percent-decoded and slash-collapsed
 *     (`/API/...`, `//api/...`, `/%61pi/...` are all treated as `/api/...`);
 *   - the query is read from the RAW query string, so repeated keys
 *     (`?status=published&status=draft`), array syntax (`status[]=draft`,
 *     `status[0]=draft`) and key-case variants (`Status=draft`) can't slip past a
 *     plain `query.status === 'draft'` check;
 *   - any `status` / `publicationState` value other than exactly `published` counts as
 *     a request for non-published content (including an empty value).
 *
 * A garbage bearer token still gets rejected downstream by Strapi's normal auth
 * resolution; this only needs to block the zero-auth case. In production nginx also
 * blocks /api/ on the public CMS hostname entirely (deploy/nginx/cms.conf.template),
 * so this is defence in depth.
 */

type DraftGuardContext = {
  path: string;
  querystring?: string;
  query?: Record<string, unknown>;
  request: { header: Record<string, string | string[] | undefined> };
  forbidden: (message: string) => void;
};

const STATUS_KEY = /^(status|publicationstate)(\[[^\]]*\])*$/i;

function isContentApiPath(rawPath: string): boolean {
  let decoded = rawPath;
  try {
    decoded = decodeURIComponent(rawPath);
  } catch {
    // Malformed percent-encoding can't match a route; fall through with the raw path.
  }
  const normalised = decoded.toLowerCase().replace(/\/{2,}/g, '/');
  return normalised === '/api' || normalised.startsWith('/api/');
}

function flatten(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(flatten);
  if (value && typeof value === 'object') return Object.values(value as Record<string, unknown>).flatMap(flatten);
  return [String(value ?? '')];
}

function requestsNonPublishedContent(ctx: DraftGuardContext): boolean {
  const values: string[] = [];

  // Raw query string: sees every occurrence of every key, whatever the casing or syntax.
  for (const [key, value] of new URLSearchParams(ctx.querystring ?? '')) {
    if (STATUS_KEY.test(key)) values.push(value);
  }

  // Parsed query (belt and braces): top-level keys only, case-insensitive.
  for (const [key, value] of Object.entries(ctx.query ?? {})) {
    if (STATUS_KEY.test(key)) values.push(...flatten(value));
  }

  return values.some((value) => value.trim().toLowerCase() !== 'published');
}

function hasBearerToken(ctx: DraftGuardContext): boolean {
  const header = ctx.request.header.authorization;
  const value = Array.isArray(header) ? header[0] : header;
  if (!value || !value.startsWith('Bearer ')) return false;
  return value.slice('Bearer '.length).trim().length > 0;
}

export default () => {
  return async (ctx: DraftGuardContext, next: () => Promise<void>) => {
    if (isContentApiPath(ctx.path) && requestsNonPublishedContent(ctx) && !hasBearerToken(ctx)) {
      return ctx.forbidden('Draft content requires authentication.');
    }
    await next();
  };
};
