import "server-only";

import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { getStrapiInternalUrl } from "./strapi-server";
import type { StrapiMedia } from "./cms-media";

/**
 * Server-only data layer for PUBLISHED content. All requests go to Strapi over the
 * internal URL (STRAPI_INTERNAL_URL). Browser-safe media helpers live in ./cms-media and
 * are re-exported here so existing server-side imports keep working. Client components
 * must import them from "@/lib/cms-media" directly.
 */
export { strapiImageUrl, toParagraphs } from "./cms-media";
export type { StrapiMedia } from "./cms-media";

/** Thrown by list/slug fetchers when Strapi can't be reached or returns an error. */
export class CmsUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CmsUnavailableError";
  }
}

const REQUEST_TIMEOUT_MS = 10_000;
/** Strapi's configured maxLimit is 100 (cms/config/api.ts) — never ask for more. */
const LIST_PAGE_SIZE = 100;

type Outcome<T> = { ok: true; data: T | null } | { ok: false; reason: string };

async function cmsRequest<T>(path: string, revalidate: number): Promise<Outcome<T>> {
  // Nothing is fetched while `next build` runs (the CMS isn't reachable inside a Docker
  // build), so no CMS-derived content can ever be baked into the build output.
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    return { ok: false, reason: "CMS is not queried during the production build" };
  }

  // Configuration errors are deliberately NOT caught below: a missing
  // STRAPI_INTERNAL_URL must fail loudly, not degrade into fake content.
  const base = getStrapiInternalUrl();

  try {
    const res = await fetch(`${base}/api/${path}`, {
      next: { revalidate },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    // A single type that hasn't been created in the CMS yet answers 404 — that's
    // "no content", not an outage.
    if (res.status === 404) return { ok: true, data: null };
    if (!res.ok) return { ok: false, reason: `Strapi responded with ${res.status}` };
    const json = await res.json();
    return { ok: true, data: (json?.data ?? null) as T };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : "Network error reaching Strapi" };
  }
}

/**
 * Single documents (pages, site settings, menu). On failure it logs and returns null;
 * callers render their own real, static copy for these. Failures are logged on the
 * server (visible in `docker logs`) rather than hidden.
 */
async function strapiFetch<T>(path: string, revalidate = 60): Promise<T | null> {
  const outcome = await cmsRequest<T>(path, revalidate);
  if (!outcome.ok) {
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
      console.error(`[cms] ${path.split("?")[0]} unavailable: ${outcome.reason}`);
    }
    return null;
  }
  return outcome.data;
}

/**
 * Collections. An outage throws CmsUnavailableError so pages can show an explicit
 * "unavailable" state — it is never confused with "genuinely empty" and never
 * replaced by invented data.
 */
async function strapiFetchList<T>(path: string, revalidate = 60): Promise<T[]> {
  const outcome = await cmsRequest<T[]>(path, revalidate);
  if (!outcome.ok) {
    throw new CmsUnavailableError(`${path.split("?")[0]}: ${outcome.reason}`);
  }
  return outcome.data ?? [];
}

export type ListItem = {
  id: number;
  number?: string;
  title?: string;
  body: string;
  note?: string;
};

/** An admin-added flexible block, appended after a page's fixed sections (or,
 *  for a fully admin-created page, the entire body of the page). */
export type CustomSectionBlock = {
  id: number;
  blockType?: "text" | "cta" | "quote" | "video";
  heading?: string;
  body?: string;
  image?: StrapiMedia | null;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  layout?: "image-left" | "image-right" | "image-top" | "text-only";
  ctaLabel?: string;
  ctaHref?: string;
  attribution?: string;
  videoUrl?: string;
};

// ---- Site Settings ----
export type SiteSetting = {
  logo?: StrapiMedia | null;
  footerTagline?: string;
  contactEmail?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  footerDisclaimer?: string;
  headerBackgroundColor?: string;
  footerBackgroundColor?: string;
  headerTextColor?: string;
  footerTextColor?: string;
  headerFooterFontFamily?: string;
  headerFooterFontSize?: "sm" | "base" | "lg";
};

export async function getSiteSetting() {
  return strapiFetch<SiteSetting>("site-setting?populate=*");
}

// ---- Home Page ----
export type HomePage = {
  heroEyebrow?: string;
  heroTitle: string;
  heroSubtitle?: string;
  heroImage?: StrapiMedia | null;
  heroPrimaryLabel?: string;
  heroPrimaryHref?: string;
  heroSecondaryLabel?: string;
  heroSecondaryHref?: string;
  heroBackgroundColor?: string;
  heroTextColor?: string;
  heroFontFamily?: string;
  introEyebrow?: string;
  introTitle?: string;
  introBody?: string;
  modelEyebrow?: string;
  modelTitle?: string;
  modelNote?: string;
  restoreEyebrow?: string;
  restoreTitle?: string;
  restoreBody?: string;
  aboutTeaserEyebrow?: string;
  aboutTeaserTitle?: string;
  aboutTeaserBody?: string;
  aboutTeaserImage?: StrapiMedia | null;
  ctaEyebrow?: string;
  ctaTitle?: string;
  ctaBody?: string;
  customSections?: CustomSectionBlock[];
};

export async function getHomePage() {
  return strapiFetch<HomePage>("home-page?populate=*");
}

// ---- About Page ----
export type AboutPage = {
  heroEyebrow?: string;
  heroTitle: string;
  heroLead?: string;
  heroPhoto?: StrapiMedia | null;
  heroBackgroundColor?: string;
  heroTextColor?: string;
  heroFontFamily?: string;
  whyEyebrow?: string;
  whyTitle?: string;
  whyBody?: string;
  goalEyebrow?: string;
  goalTitle?: string;
  goalBody?: string;
  values?: ListItem[];
  beyondEyebrow?: string;
  beyondTitle?: string;
  beyondBody?: string;
  hikingPhoto?: StrapiMedia | null;
  dogPhoto?: StrapiMedia | null;
  ctaEyebrow?: string;
  ctaTitle?: string;
  customSections?: CustomSectionBlock[];
};

export async function getAboutPage() {
  return strapiFetch<AboutPage>("about-page?populate=*");
}

// ---- Educational Consults Page ----
export type EducationalConsultsPage = {
  heroEyebrow?: string;
  heroTitle: string;
  heroLead?: string;
  heroVideoUrl?: string;
  videoCaption?: string;
  heroBackgroundColor?: string;
  heroTextColor?: string;
  heroFontFamily?: string;
  whatEyebrow?: string;
  whatTitle?: string;
  whatBody?: string;
  exploreEyebrow?: string;
  exploreTitle?: string;
  exploreItems?: ListItem[];
  fitEyebrow?: string;
  fitTitle?: string;
  fitItems?: ListItem[];
  ctaEyebrow?: string;
  ctaTitle?: string;
  ctaBody?: string;
  customSections?: CustomSectionBlock[];
};

export async function getEducationalConsultsPage() {
  return strapiFetch<EducationalConsultsPage>("educational-consults-page?populate=*");
}

// ---- Group Sessions Page ----
export type GroupSessionsPage = {
  heroEyebrow?: string;
  heroTitle: string;
  heroLead?: string;
  heroVideoUrl?: string;
  videoCaption?: string;
  heroBackgroundColor?: string;
  heroTextColor?: string;
  heroFontFamily?: string;
  howEyebrow?: string;
  howTitle?: string;
  howBody?: string;
  seriesEyebrow?: string;
  seriesTitle?: string;
  sessions?: ListItem[];
  designedEyebrow?: string;
  designedTitle?: string;
  designedBody?: string;
  ctaEyebrow?: string;
  ctaTitle?: string;
  ctaBody?: string;
  customSections?: CustomSectionBlock[];
};

export async function getGroupSessionsPage() {
  return strapiFetch<GroupSessionsPage>("group-sessions-page?populate=*");
}

// ---- Speaking & Retreats Page ----
export type SpeakingRetreatsPage = {
  heroEyebrow?: string;
  heroTitle: string;
  heroLead?: string;
  heroVideoUrl?: string;
  videoCaption?: string;
  heroBackgroundColor?: string;
  heroTextColor?: string;
  heroFontFamily?: string;
  forGroupsEyebrow?: string;
  forGroupsTitle?: string;
  forGroupsBody?: string;
  topicsEyebrow?: string;
  topicsTitle?: string;
  topics?: ListItem[];
  formatsEyebrow?: string;
  formatsTitle?: string;
  formats?: ListItem[];
  ctaEyebrow?: string;
  ctaTitle?: string;
  ctaBody?: string;
  customSections?: CustomSectionBlock[];
};

export async function getSpeakingRetreatsPage() {
  return strapiFetch<SpeakingRetreatsPage>("speaking-retreats-page?populate=*");
}

// ---- Blog Posts ----
export type BlogPost = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  category?: string;
  excerpt?: string;
  body?: string;
  coverImage?: StrapiMedia | null;
  publishedDate?: string;
  readTime?: string;
};

/** Throws CmsUnavailableError if the CMS can't be reached. */
export async function getBlogPosts() {
  return strapiFetchList<BlogPost>(
    `blog-posts?populate=*&sort=publishedDate:desc&pagination[pageSize]=${LIST_PAGE_SIZE}`
  );
}

/** Returns null only when the post genuinely doesn't exist; throws CmsUnavailableError on outage. */
export async function getBlogPostBySlug(slug: string) {
  const posts = await strapiFetchList<BlogPost>(
    `blog-posts?populate=*&filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[pageSize]=1`
  );
  return posts[0] ?? null;
}

// ---- Products ----
export type Product = {
  id: number;
  documentId: string;
  name: string;
  category?: string;
  price: number;
  blurb?: string;
  image?: StrapiMedia | null;
  order?: number;
};

/** Throws CmsUnavailableError if the CMS can't be reached. */
export async function getProducts() {
  return strapiFetchList<Product>(
    `products?populate=*&sort=order:asc&pagination[pageSize]=${LIST_PAGE_SIZE}`
  );
}

// ---- Booking Services ----
export type BookingService = {
  id: number;
  documentId: string;
  title: string;
  duration?: string;
  price?: string;
  description?: string;
  order?: number;
};

/** Throws CmsUnavailableError if the CMS can't be reached. */
export async function getBookingServices() {
  return strapiFetchList<BookingService>(
    `booking-services?populate=*&sort=order:asc&pagination[pageSize]=${LIST_PAGE_SIZE}`
  );
}

// ---- Menu Items ----
export type MenuItemEntry = {
  id: number;
  documentId: string;
  label: string;
  href: string;
  group: "primary" | "services" | "resources" | "secondary";
  order: number;
  openInNewTab?: boolean;
};

/**
 * Returns null (not []) on failure, unlike the list fetchers above — an empty
 * blog list is a fine UI state, an empty *nav* isn't, so callers need to tell
 * "Strapi unreachable" apart from "admin genuinely deleted every item" and fall
 * back to FALLBACK_MENU_ITEMS in nav-links.ts only for the former.
 */
export async function getMenuItems() {
  return strapiFetch<MenuItemEntry[]>(
    `menu-items?populate=*&sort=order:asc&pagination[pageSize]=${LIST_PAGE_SIZE}`
  );
}

// ---- Dynamic (admin-created) Pages ----
export type DynamicPage = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  seoDescription?: string;
  heroEyebrow?: string;
  heroTitle: string;
  heroLead?: string;
  heroImage?: StrapiMedia | null;
  heroBackgroundColor?: string;
  heroTextColor?: string;
  heroFontFamily?: string;
  sections?: CustomSectionBlock[];
};

/** Returns null only when no such page exists; throws CmsUnavailableError on outage. */
export async function getDynamicPageBySlug(slug: string) {
  const pages = await strapiFetchList<DynamicPage>(
    `dynamic-pages?populate=*&filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[pageSize]=1`
  );
  return pages[0] ?? null;
}

export async function getDynamicPages() {
  return strapiFetchList<DynamicPage>(
    `dynamic-pages?populate=*&sort=title:asc&pagination[pageSize]=${LIST_PAGE_SIZE}`
  );
}
