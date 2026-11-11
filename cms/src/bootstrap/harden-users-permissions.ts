import type { Core } from '@strapi/strapi';

type PluginStore = {
  get: (params: Record<string, unknown>) => Promise<unknown>;
  set: (params: Record<string, unknown>) => Promise<unknown>;
};

/**
 * Turns off public self-registration (POST /api/auth/local/register).
 *
 * The website never signs visitors up, but Strapi's users-permissions plugin enables
 * sign-ups by default. The setting lives in Strapi's database (Settings -> Users &
 * Permissions -> Advanced settings -> "Enable sign-ups"), not in a config file, so it is
 * applied here at startup. It is idempotent and only ever sets the flag to false.
 * (nginx also blocks /api/ on the public CMS hostname — see deploy/nginx/cms.conf.template.)
 */
export default async function hardenUsersPermissions({ strapi }: { strapi: Core.Strapi }) {
  try {
    const store = (strapi as unknown as { store: (config: Record<string, unknown>) => PluginStore }).store({
      type: 'plugin',
      name: 'users-permissions',
    });

    const advanced = (await store.get({ key: 'advanced' })) as Record<string, unknown> | null;

    if (!advanced) {
      strapi.log.warn(
        '[security] users-permissions advanced settings not found; could not verify that sign-ups are disabled. ' +
          'Turn off "Enable sign-ups" in Settings -> Users & Permissions -> Advanced settings.'
      );
      return;
    }

    if (advanced.allow_register === false) return;

    await store.set({ key: 'advanced', value: { ...advanced, allow_register: false } });
    strapi.log.info('[security] Public self-registration disabled (users-permissions allow_register=false).');
  } catch (error) {
    strapi.log.warn(
      `[security] Could not disable public self-registration automatically: ${
        error instanceof Error ? error.message : String(error)
      }. Turn off "Enable sign-ups" in Settings -> Users & Permissions -> Advanced settings.`
    );
  }
}
