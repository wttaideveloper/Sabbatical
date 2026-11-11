"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FALLBACK_MENU_ITEMS, type MenuItem } from "@/lib/nav-links";
import { safeHref } from "@/lib/safe-url";
import type { MenuItemEntry, SiteSetting } from "@/lib/strapi";
import { fontFamilyCssVar } from "@/lib/font-options";
import { fontSizeRem } from "@/lib/font-size-options";
import NavDropdown from "./NavDropdown";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function SiteHeader({
  menuItems,
  siteSetting,
}: {
  menuItems: MenuItemEntry[] | null;
  siteSetting: SiteSetting | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  if (pathname.startsWith("/admin")) return null;

  // Treat an empty collection the same as "unreachable" — a genuinely empty
  // header (before the admin has ever used the menu manager, or if every item
  // was removed) should show the sensible default nav, not nothing at all.
  // Menu hrefs come from the CMS, so unsafe ones (javascript:, data:, ...) are dropped.
  const sourceItems: MenuItem[] = menuItems && menuItems.length > 0 ? menuItems : FALLBACK_MENU_ITEMS;
  const safeItems = sourceItems.flatMap((item) => {
    const href = safeHref(item.href);
    return href ? [{ ...item, href }] : [];
  });
  const items: MenuItem[] = safeItems.length > 0 ? safeItems : FALLBACK_MENU_ITEMS;
  const byGroup = (group: MenuItem["group"]) =>
    items.filter((i) => i.group === group).sort((a, b) => a.order - b.order);
  const primary = byGroup("primary");
  const services = byGroup("services");
  const resources = byGroup("resources");
  const secondary = byGroup("secondary");
  const mobileItems = [...primary, ...services, ...resources, ...secondary];

  const headerStyle = siteSetting?.headerBackgroundColor
    ? {
        backgroundColor: siteSetting.headerBackgroundColor,
        color: siteSetting.headerTextColor || undefined,
        fontFamily: fontFamilyCssVar(siteSetting.headerFooterFontFamily),
        fontSize: fontSizeRem(siteSetting.headerFooterFontSize),
      }
    : undefined;
  const linkClassName = (isActive: boolean) =>
    `relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 transition-colors ${
      isActive ? "text-burgundy" : headerStyle ? "" : "text-ink hover:text-coral"
    }`;

  return (
    <header
      className="sticky top-0 z-50 border-b border-line bg-cream/95 backdrop-blur-md"
      style={headerStyle}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1240px] items-center justify-between px-6 sm:px-8 lg:px-10">
        <Link href="/" aria-label="Intimate Sabbatical home" className="shrink-0">
          <motion.div
            className="overflow-hidden"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src="/assets/logo-transparent.png"
              alt="Intimate Sabbatical"
              width={300}
              height={300}
              className="h-[60px] w-[118px] object-cover object-top sm:h-[69px] sm:w-[134px]"
              priority
            />
          </motion.div>
        </Link>

        <nav className="hidden items-center gap-1 text-[11px] font-medium uppercase tracking-[0.12em] lg:flex">
          {primary.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={linkClassName(isActive)}>
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-burgundy/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
          <NavDropdown label="Services" items={services} />
          <NavDropdown label="Resources" items={resources} />
          {secondary.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={linkClassName(isActive)}>
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-burgundy/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
          <div className="ml-2 flex shrink-0 items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/booking"
                className="whitespace-nowrap rounded-full border border-burgundy bg-burgundy px-6 py-3 text-white transition-colors hover:bg-burgundy-dark hover:border-burgundy-dark"
              >
                Book a Consult
              </Link>
            </motion.div>
          </div>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
          >
            <motion.span
              className="block h-px w-6 bg-ink"
              animate={open ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
            />
            <motion.span
              className="block h-px w-6 bg-ink"
              animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
            />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden border-t border-line bg-cream lg:hidden"
          >
            <motion.nav
              className="flex flex-col gap-1 px-6 py-6 text-sm uppercase tracking-[0.1em]"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
                closed: {},
              }}
            >
              {mobileItems.map((link) => {
                const isActive =
                  link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                const className = `block rounded-full px-4 py-3 transition-colors ${
                  isActive ? "bg-burgundy/10 text-burgundy" : "text-ink hover:text-coral"
                }`;
                return (
                  <motion.div
                    key={link.href}
                    variants={{
                      open: { opacity: 1, x: 0 },
                      closed: { opacity: 0, x: -12 },
                    }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    {link.openInNewTab ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className={className}>
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
              <motion.div
                variants={{
                  open: { opacity: 1, x: 0 },
                  closed: { opacity: 0, x: -12 },
                }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <Link
                  href="/booking"
                  className="mt-3 inline-flex w-fit rounded-full border border-burgundy bg-burgundy px-6 py-3 text-[11px] font-semibold text-white"
                >
                  Book a Consult
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
