const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export type StrapiMedia = {
  id: number;
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
};

export function strapiImageUrl(media?: StrapiMedia | null): string | undefined {
  if (!media?.url) return undefined;
  return media.url.startsWith("http") ? media.url : `${STRAPI_URL}${media.url}`;
}

/** Splits a plain-text/markdown-ish richtext field on blank lines into paragraphs. */
export function toParagraphs(text?: string): string[] {
  if (!text) return [];
  return text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

async function strapiFetch<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${path}`, {
      next: { revalidate },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data ?? null) as T;
  } catch {
    return null;
  }
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

export async function getBlogPosts() {
  const posts = await strapiFetch<BlogPost[]>(
    "blog-posts?populate=*&sort=publishedDate:desc"
  );
  return posts ?? [];
}

export async function getBlogPostBySlug(slug: string) {
  const posts = await strapiFetch<BlogPost[]>(
    `blog-posts?populate=*&filters[slug][$eq]=${encodeURIComponent(slug)}`
  );
  return posts?.[0] ?? null;
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

export async function getProducts() {
  const products = await strapiFetch<Product[]>("products?populate=*&sort=order:asc");
  return products ?? [];
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

export async function getBookingServices() {
  const services = await strapiFetch<BookingService[]>(
    "booking-services?populate=*&sort=order:asc"
  );
  return services ?? [];
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
  return strapiFetch<MenuItemEntry[]>("menu-items?populate=*&sort=order:asc&pagination[pageSize]=100");
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

export async function getDynamicPageBySlug(slug: string) {
  const pages = await strapiFetch<DynamicPage[]>(
    `dynamic-pages?populate=*&filters[slug][$eq]=${encodeURIComponent(slug)}`
  );
  return pages?.[0] ?? null;
}

export async function getDynamicPages() {
  const pages = await strapiFetch<DynamicPage[]>("dynamic-pages?populate=*&sort=title:asc");
  return pages ?? [];
}
