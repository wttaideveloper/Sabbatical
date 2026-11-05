import type { Core } from '@strapi/strapi';

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

export default async function setPublicPermissions({ strapi }: { strapi: Core.Strapi }) {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) return;

  for (const uid of CONTENT_TYPES) {
    for (const action of ['find', 'findOne']) {
      const actionName = `api::${uid}.${uid}.${action}`;
      const existing = await strapi.query('plugin::users-permissions.permission').findOne({
        where: { action: actionName, role: publicRole.id },
      });
      if (!existing) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action: actionName, role: publicRole.id },
        });
      }
    }
  }

  strapi.log.info('[bootstrap] Public read permissions ensured for site content types.');
}
