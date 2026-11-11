import type { Core } from '@strapi/strapi';

/** Content types the public website reads. Read access only — never create/update/delete. */
const CONTENT_TYPES = [
  'home-page',
  'about-page',
  'site-setting',
  'blog-post',
  'product',
  'booking-service',
  'educational-consults-page',
  'group-sessions-page',
  'speaking-retreats-page',
  'menu-item',
  'dynamic-page',
];

const READ_ACTIONS = ['find', 'findOne'] as const;

/** Any permission ending in one of these on the Public role is a write capability. */
const WRITE_ACTION = /\.(create|update|delete|destroy|publish|unpublish|upload)$/;

const STORE_KEY = 'public-read-permissions-v1';

type CoreStore = {
  get: (params: Record<string, unknown>) => Promise<unknown>;
  set: (params: Record<string, unknown>) => Promise<unknown>;
};

function getStore(strapi: Core.Strapi): CoreStore {
  return (strapi as unknown as { store: (config: Record<string, unknown>) => CoreStore }).store({
    type: 'core',
    name: 'intimate-sabbatical',
  });
}

/**
 * Makes sure the Public role can READ the site's content types — and nothing else.
 *
 * Safety properties:
 *  - It only ever creates `find` / `findOne` permissions. It never grants write access.
 *  - It runs ONCE (recorded in Strapi's core store). After that it never touches
 *    permissions again, so a restriction an administrator sets on purpose in
 *    Settings -> Users & Permissions -> Public is never silently re-granted on restart.
 *    To deliberately re-apply the defaults (e.g. after adding a content type), start
 *    Strapi once with STRAPI_SYNC_PUBLIC_PERMISSIONS=true; it still only adds missing reads.
 *  - It warns (but does not change anything) if the Public role holds any write permission.
 */
export default async function setPublicPermissions({ strapi }: { strapi: Core.Strapi }) {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) {
    strapi.log.warn('[permissions] Public role not found; skipping public read permissions.');
    return;
  }

  const permissionQuery = strapi.query('plugin::users-permissions.permission');
  const existing = (await permissionQuery.findMany({ where: { role: publicRole.id } })) as Array<{
    action: string;
  }>;

  const writeActions = existing.map((p) => p.action).filter((action) => WRITE_ACTION.test(action));
  if (writeActions.length > 0) {
    strapi.log.warn(
      `[permissions] The Public role has write-capable permissions (${writeActions.join(', ')}). ` +
        'Review Settings -> Users & Permissions -> Roles -> Public. This script never grants them and will not remove them.'
    );
  }

  const store = getStore(strapi);
  const alreadyApplied = Boolean(await store.get({ key: STORE_KEY }));
  const forceSync = process.env.STRAPI_SYNC_PUBLIC_PERMISSIONS === 'true';

  if (alreadyApplied && !forceSync) {
    strapi.log.info('[permissions] Public read permissions were already initialised; leaving them unchanged.');
    return;
  }

  const have = new Set(existing.map((p) => p.action));
  let created = 0;

  for (const uid of CONTENT_TYPES) {
    for (const action of READ_ACTIONS) {
      const actionName = `api::${uid}.${uid}.${action}`;
      if (have.has(actionName)) continue;
      await permissionQuery.create({ data: { action: actionName, role: publicRole.id } });
      created += 1;
    }
  }

  await store.set({ key: STORE_KEY, value: { appliedAt: new Date().toISOString() } });
  strapi.log.info(`[permissions] Public read permissions initialised (${created} added).`);
}
