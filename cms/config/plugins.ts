import type { Core } from '@strapi/strapi';

/** Keep in sync with nginx client_max_body_size, Next.js bodySizeLimit and middlewares.ts. */
const UPLOAD_LIMIT_BYTES = 20 * 1024 * 1024; // 20 MB

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedTypes = [
  'image/svg+xml',
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      // Required in production (enforced at startup); set via JWT_SECRET.
      jwtSecret: env('JWT_SECRET'),
      jwtManagement: 'refresh',
      sessions: {
        httpOnly: true,
      },
      // Public self-registration is also switched off in the database at startup
      // (src/bootstrap/harden-users-permissions.ts); the website never signs users up.
    },
  },
  upload: {
    config: {
      // Maximum size of a single uploaded file, in bytes.
      sizeLimit: UPLOAD_LIMIT_BYTES,
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes,
      },
    },
  },
});

export default config;
