/**
 * Strapi's `status` query param (draft vs published) is just a validated
 * request parameter, not a separate permission scope — the Public role's
 * `find`/`findOne` grant lets an unauthenticated caller read DRAFT content
 * simply by appending `?status=draft` to any content-API URL (confirmed
 * empirically against this app's own API). Now that the admin panel relies on
 * real draft state — edits stay unpublished until "Publish Live" — an
 * unauthenticated draft read would leak unpublished content to any visitor.
 * This closes that gap: a `status=draft` request must carry a bearer token.
 * (A garbage/invalid token still gets rejected downstream by Strapi's normal
 * auth resolution — this only needs to block the zero-auth case.)
 */
export default () => {
  return async (ctx: { request: { path: string; header: { authorization?: string } }; forbidden: (msg: string) => void }, next: () => Promise<void>) => {
    const query = (ctx as unknown as { query: Record<string, unknown> }).query;
    if (ctx.request.path.startsWith('/api/') && query?.status === 'draft') {
      const authHeader = ctx.request.header.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.trim() === 'Bearer') {
        return ctx.forbidden('Draft content requires authentication.');
      }
    }
    await next();
  };
};
