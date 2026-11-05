import type { Core } from '@strapi/strapi';
import setPublicPermissions from './bootstrap/set-public-permissions';
import seed from './bootstrap/seed';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setPublicPermissions({ strapi });
    await seed({ strapi });
  },
};
