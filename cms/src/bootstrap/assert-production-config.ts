import type { Core } from '@strapi/strapi';

/** Every one of these must be set (and not a copied placeholder) for a production start. */
const REQUIRED_IN_PRODUCTION = [
  'APP_KEYS',
  'ADMIN_JWT_SECRET',
  'API_TOKEN_SALT',
  'TRANSFER_TOKEN_SALT',
  'ENCRYPTION_KEY',
  'JWT_SECRET',
  'PUBLIC_URL',
  'CORS_ORIGINS',
] as const;

const PLACEHOLDER = /REPLACE_?ME|CHANGE_?ME|tobemodified/i;

/**
 * Fails startup with a clear message when production configuration is missing or still
 * contains values copied from .env.example. Runs in `register()`, i.e. when the server
 * starts — not during `strapi build`, so images can be built without any secrets.
 */
export default function assertProductionConfig(strapi: Core.Strapi) {
  if (process.env.NODE_ENV !== 'production') return;

  const problems: string[] = [];

  for (const name of REQUIRED_IN_PRODUCTION) {
    const value = process.env[name]?.trim();
    if (!value) problems.push(`${name} is not set`);
    else if (PLACEHOLDER.test(value)) problems.push(`${name} still contains a placeholder value`);
  }

  if (problems.length > 0) {
    throw new Error(
      `Refusing to start Strapi in production with invalid configuration:\n - ${problems.join('\n - ')}\n` +
        'See cms/.env.example and DEPLOYMENT.md.'
    );
  }

  if ((process.env.STRAPI_SEED ?? '').trim().toLowerCase() === 'true') {
    strapi.log.warn('[seed] STRAPI_SEED=true is ignored: the seed script never runs in production.');
  }
}
