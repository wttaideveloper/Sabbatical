import type { Core } from '@strapi/strapi';

/** Keep in sync with nginx client_max_body_size, Next.js bodySizeLimit and plugins.ts sizeLimit. */
const UPLOAD_LIMIT_BYTES = 20 * 1024 * 1024; // 20 MB

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => {
  const isProduction = env('NODE_ENV') === 'production';

  // Explicit allow-list (comma-separated). No wildcard default in production: the
  // frontend talks to Strapi server-side over the internal network, so browsers only
  // ever need the admin panel, which is same-origin.
  const corsOrigins = env.array(
    'CORS_ORIGINS',
    isProduction ? [] : ['http://localhost:3000', 'http://localhost:1337']
  );

  return [
    'strapi::logger',
    'strapi::errors',
    'strapi::security',
    {
      name: 'strapi::cors',
      config: {
        origin: corsOrigins,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
        headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
        keepHeadersOnError: true,
      },
    },
    // 'strapi::poweredBy' intentionally omitted: no X-Powered-By: Strapi banner.
    'strapi::query',
    // Must come after strapi::query (needs the parsed query string) and before any route.
    'global::block-public-draft-reads',
    {
      name: 'strapi::body',
      config: {
        formidable: {
          maxFileSize: UPLOAD_LIMIT_BYTES,
        },
      },
    },
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};

export default config;
