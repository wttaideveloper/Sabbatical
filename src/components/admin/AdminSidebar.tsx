"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_GROUPS: { label: string; items: { label: string; href: string }[] }[] = [
  { label: "Overview", items: [{ label: "Dashboard", href: "/admin" }] },
  {
    label: "Site",
    items: [
      { label: "Site Settings", href: "/admin/site-settings" },
      { label: "Menu", href: "/admin/menu" },
    ],
  },
  {
    label: "Pages",
    items: [
      { label: "Custom Pages", href: "/admin/pages" },
      { label: "Home Page", href: "/admin/home-page" },
      { label: "About Page", href: "/admin/about-page" },
      { label: "Educational Consults", href: "/admin/educational-consults" },
      { label: "Group Sessions", href: "/admin/group-sessions" },
      { label: "Speaking & Retreats", href: "/admin/speaking-retreats" },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Blog Posts", href: "/admin/blog" },
      { label: "Products", href: "/admin/products" },
      { label: "Booking Services", href: "/admin/booking-services" },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentLabel = ALL_ITEMS.find((item) => isActive(pathname, item.href))?.label || "Menu";

  return (
    <nav className="w-full shrink-0 lg:w-64">
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        aria-expanded={mobileOpen}
        className="mb-4 flex w-full items-center justify-between rounded-xl border border-admin-border bg-white px-4 py-3 text-sm font-medium text-ink shadow-[0_1px_2px_rgba(25,27,34,0.04)] lg:hidden"
      >
        <span>
          <span className="text-admin-muted">Section:</span> {currentLabel}
        </span>
        <span className={`text-admin-muted transition-transform ${mobileOpen ? "rotate-180" : ""}`}>&darr;</span>
      </button>

      <div
        className={`${
          mobileOpen ? "flex" : "hidden"
        } flex-col gap-6 rounded-2xl border border-admin-border bg-white p-4 shadow-[0_1px_2px_rgba(25,27,34,0.04)] lg:flex lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <span className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-admin-muted">
              {group.label}
            </span>
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg border-l-2 px-3 py-2 text-sm transition-colors ${
                    active
                      ? "border-burgundy bg-burgundy/[0.06] font-medium text-burgundy"
                      : "border-transparent text-ink hover:border-admin-border-strong hover:bg-admin-bg"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </nav>
  );
}
