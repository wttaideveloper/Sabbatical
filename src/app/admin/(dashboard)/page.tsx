import Link from "next/link";
import { isStrapiTokenConfigured } from "@/lib/strapi-admin";

const SECTIONS = [
  { label: "Site Settings", href: "/admin/site-settings", body: "Logo, contact email, social links, header/footer theme." },
  { label: "Menu", href: "/admin/menu", body: "Add, rename, reorder, and remove navigation links." },
  { label: "Custom Pages", href: "/admin/pages", body: "Build brand-new pages from scratch, at their own URL." },
  { label: "Home Page", href: "/admin/home-page", body: "Hero, intro, model, restore, about teaser, CTA." },
  { label: "About Page", href: "/admin/about-page", body: "Bio, values, personality photos." },
  { label: "Educational Consults", href: "/admin/educational-consults", body: "Hero, explore items, fit checklist." },
  { label: "Group Sessions", href: "/admin/group-sessions", body: "Hero, series sessions, who it's for." },
  { label: "Speaking & Retreats", href: "/admin/speaking-retreats", body: "Hero, topics, formats." },
  { label: "Blog Posts", href: "/admin/blog", body: "Add, edit, and remove articles." },
  { label: "Products", href: "/admin/products", body: "Shop items, pricing, images." },
  { label: "Booking Services", href: "/admin/booking-services", body: "Options shown on the booking flow." },
];

export default function AdminHomePage() {
  const configured = isStrapiTokenConfigured();

  return (
    <div>
      {!configured && (
        <div className="mb-8 rounded-2xl border border-coral/25 bg-coral/5 p-6">
          <h2 className="mb-2 font-sans text-lg font-semibold text-coral">Strapi API token not configured</h2>
          <p className="text-sm leading-relaxed text-ink/80">
            You can browse and edit everything here, but saving won&apos;t reach Strapi yet. In
            the Strapi admin (
            <code className="rounded bg-white px-1.5 py-0.5 text-xs">localhost:1337/admin</code>
            ), go to <strong>Settings → API Tokens → Create new API Token</strong>,
            set duration to Unlimited and type to Full access, then paste the value into{" "}
            <code className="rounded bg-white px-1.5 py-0.5 text-xs">STRAPI_API_TOKEN</code> in{" "}
            <code className="rounded bg-white px-1.5 py-0.5 text-xs">.env.local</code> and restart
            the dev server.
          </p>
        </div>
      )}

      <h2 className="mb-6 font-sans text-2xl font-semibold text-burgundy">What would you like to edit?</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-2xl border border-admin-border bg-white p-6 shadow-[0_1px_2px_rgba(25,27,34,0.04)] transition-all hover:border-burgundy/30 hover:shadow-[0_18px_40px_-24px_rgba(28,21,23,0.25)]"
          >
            <h3 className="mb-1 text-base font-semibold text-ink">{s.label}</h3>
            <p className="text-sm text-admin-muted">{s.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
