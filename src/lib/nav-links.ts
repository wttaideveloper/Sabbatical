export type NavLink = {
  label: string;
  href: string;
};

export const PRIMARY_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

export const SERVICE_LINKS: NavLink[] = [
  { label: "Educational Consults", href: "/educational-consults" },
  { label: "Group Sessions", href: "/group-sessions" },
  { label: "Speaking & Retreats", href: "/speaking-retreats" },
];

export const SECONDARY_LINKS: NavLink[] = [
  { label: "Blog", href: "/blog" },
  { label: "Shop", href: "/shop" },
];

export const NAV_LINKS: NavLink[] = [...PRIMARY_LINKS, ...SERVICE_LINKS, ...SECONDARY_LINKS];

export const CONTACT_EMAIL = "hello@intimatesabbatical.com";
