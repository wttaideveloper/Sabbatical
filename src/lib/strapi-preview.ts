import "server-only";
import { getSingleType, listCollection } from "./strapi-admin";
import type {
  AboutPage,
  DynamicPage,
  EducationalConsultsPage,
  GroupSessionsPage,
  HomePage,
  MenuItemEntry,
  SiteSetting,
  SpeakingRetreatsPage,
} from "./strapi";

/**
 * Draft-status reads for Next.js Draft Mode preview — a sibling file rather than
 * a change to strapi.ts, so the live site's published-only fetchers there have
 * zero diff and zero regression risk. Draft reads require STRAPI_API_TOKEN (see
 * cms/src/middlewares/block-public-draft-reads.ts), so these wrap strapi-admin.ts's
 * already-authenticated, already-tested functions instead of a separate fetch —
 * that also means every call here is `cache: "no-store"` for free (baked into
 * strapiAdminFetch), so preview never shows stale ISR data.
 */

export async function getHomePagePreview(): Promise<HomePage | null> {
  return (await getSingleType<HomePage>("home-page", { status: "draft" })).data;
}

export async function getAboutPagePreview(): Promise<AboutPage | null> {
  return (await getSingleType<AboutPage>("about-page", { status: "draft" })).data;
}

export async function getEducationalConsultsPagePreview(): Promise<EducationalConsultsPage | null> {
  return (await getSingleType<EducationalConsultsPage>("educational-consults-page", { status: "draft" })).data;
}

export async function getGroupSessionsPagePreview(): Promise<GroupSessionsPage | null> {
  return (await getSingleType<GroupSessionsPage>("group-sessions-page", { status: "draft" })).data;
}

export async function getSpeakingRetreatsPagePreview(): Promise<SpeakingRetreatsPage | null> {
  return (await getSingleType<SpeakingRetreatsPage>("speaking-retreats-page", { status: "draft" })).data;
}

export async function getSiteSettingPreview(): Promise<SiteSetting | null> {
  return (await getSingleType<SiteSetting>("site-setting", { status: "draft" })).data;
}

export async function getMenuItemsPreview(): Promise<MenuItemEntry[] | null> {
  return (await listCollection<MenuItemEntry>("menu-items", "order:asc", { status: "draft" })).data;
}

export async function getDynamicPageBySlugPreview(slug: string): Promise<DynamicPage | null> {
  const result = await listCollection<DynamicPage>("dynamic-pages", "title:asc", { status: "draft" });
  return result.data?.find((p) => p.slug === slug) ?? null;
}
