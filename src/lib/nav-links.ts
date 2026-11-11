export type MenuItem = {
  label: string;
  href: string;
  group: "primary" | "services" | "resources" | "secondary";
  order: number;
  openInNewTab?: boolean;
};

/**
 * Used when Strapi is unreachable (getMenuItems() returns null) — same shape as
 * MenuItemEntry from lib/strapi so SiteHeader never needs to branch on where the
 * data came from. These are real site routes (navigation only), not invented content.
 */
export const FALLBACK_MENU_ITEMS: MenuItem[] = [
  { label: "Home", href: "/", group: "primary", order: 0 },
  { label: "About", href: "/about", group: "primary", order: 1 },
  { label: "Educational Consults", href: "/educational-consults", group: "services", order: 0 },
  { label: "Group Sessions", href: "/group-sessions", group: "services", order: 1 },
  { label: "Speaking & Retreats", href: "/speaking-retreats", group: "services", order: 2 },
  { label: "All Resources", href: "/resources", group: "resources", order: 0 },
  { label: "Blog", href: "/blog", group: "resources", order: 1 },
  { label: "Videos", href: "/videos", group: "resources", order: 2 },
  { label: "FAQ", href: "/faq", group: "resources", order: 3 },
  { label: "Shop", href: "/shop", group: "secondary", order: 0 },
  { label: "Contact", href: "/contact", group: "secondary", order: 1 },
];

// Configured through NEXT_PUBLIC_CONTACT_EMAIL (see lib/public-config.ts).
export { CONTACT_EMAIL } from "./public-config";
