import type { Core } from '@strapi/strapi';
import assertProductionConfig from './bootstrap/assert-production-config';
import setPublicPermissions from './bootstrap/set-public-permissions';
import hardenUsersPermissions from './bootstrap/harden-users-permissions';
import seed, { isSeedEnabled } from './bootstrap/seed';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    assertProductionConfig(strapi);
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setPublicPermissions({ strapi });
    await hardenUsersPermissions({ strapi });

    // The seed script creates AND PUBLISHES sample pages, blog posts, products and booking
    // services. It is a local-development convenience only: it runs when NODE_ENV is not
    // "production" AND STRAPI_SEED=true is set explicitly. Production can never run it.
    if (isSeedEnabled()) {
      await seed({ strapi });
    } else {
      strapi.log.info('[seed] Skipped (runs only when NODE_ENV!=production and STRAPI_SEED=true).');
    }
  },
};
