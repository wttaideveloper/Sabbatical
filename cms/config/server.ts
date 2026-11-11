import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => {
  const serverConfig = {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),

    // Public URL of the CMS (e.g. https://<cms-domain>). Needed behind a reverse proxy so
    // absolute URLs and admin-panel cookies are generated for the public HTTPS address.
    // Required in production (enforced at startup in src/bootstrap/assert-production-config.ts).
    url: env('PUBLIC_URL', ''),

    // Strapi sits behind nginx, which terminates TLS. `koa: true` makes Strapi trust the
    // X-Forwarded-* headers so it knows the original request was HTTPS (required for the
    // secure admin cookies). `maxIpsCount: 1` = exactly one trusted proxy hop (nginx).
    // Keep IS_PROXIED=false only for direct local development.
    proxy: {
      koa: env.bool('IS_PROXIED', env('NODE_ENV') === 'production'),
      ipHeader: env('PROXY_IP_HEADER', 'X-Forwarded-For'),
      maxIpsCount: env.int('MAX_IPS_COUNT', 1),
    },

    app: {
      keys: env.array('APP_KEYS')!,
    },
    webhooks: {
      populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
    },
  };

  // The typed shape of `proxy` differs between Strapi 5.x releases; this is the documented
  // 5.52+ object form (https://docs.strapi.io/cms/configurations/server).
  return serverConfig as unknown as Core.Config.Server;
};

export default config;
