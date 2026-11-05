import type { Context } from 'koa';

/**
 * The Next.js admin's write client keys everything on the REST path segment it
 * already uses for reads/writes (singular for single types, e.g. "home-page";
 * plural for collection types, e.g. "products"). Strapi's Document Service needs
 * the full internal uid instead ("api::home-page.home-page", "api::product.product"
 * — note collection types differ between their plural REST path and singular uid).
 * Resolving here means the Next.js side never has to know Strapi's internal uid
 * format — it just reuses the same string it already sends everywhere else.
 */
function resolveUid(input: string): string | undefined {
  const match = Object.values(strapi.contentTypes).find((ct) => {
    if (!ct.uid?.startsWith('api::')) return false;
    return ct.uid === input || ct.info?.singularName === input || ct.info?.pluralName === input;
  });
  return match?.uid;
}

export default {
  async publish(ctx: Context) {
    const body = (ctx.request.body ?? {}) as { uid?: string; documentId?: string };
    const { uid: rawUid, documentId } = body;

    if (!rawUid || !documentId) {
      return ctx.badRequest('uid and documentId are required');
    }

    const uid = resolveUid(rawUid);
    if (!uid) {
      return ctx.badRequest(`Unknown content type: ${rawUid}`);
    }

    try {
      const result = await strapi.documents(uid as never).publish({ documentId });
      ctx.body = { data: { documentId: result.documentId, entry: result.entries?.[0] ?? null } };
    } catch (err) {
      ctx.badRequest(err instanceof Error ? err.message : 'Publish failed');
    }
  },
};
