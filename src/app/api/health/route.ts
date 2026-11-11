/**
 * Liveness probe for Docker's healthcheck. Deliberately does NOT touch Strapi (or anything
 * else): it only reports that this Node process is up and serving requests, so a CMS outage
 * can never make Docker restart a perfectly healthy web container.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
}
