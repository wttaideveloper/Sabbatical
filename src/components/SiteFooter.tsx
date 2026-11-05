"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "./Container";
import { CONTACT_EMAIL } from "@/lib/nav-links";
import type { SiteSetting } from "@/lib/strapi";
import { fontFamilyCssVar } from "@/lib/font-options";
import { fontSizeRem } from "@/lib/font-size-options";

export default function SiteFooter({ siteSetting }: { siteSetting: SiteSetting | null }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const footerStyle = siteSetting?.footerBackgroundColor
    ? {
        backgroundColor: siteSetting.footerBackgroundColor,
        color: siteSetting.footerTextColor || undefined,
        fontFamily: fontFamilyCssVar(siteSetting.headerFooterFontFamily),
        fontSize: fontSizeRem(siteSetting.headerFooterFontSize),
      }
    : undefined;

  return (
    <footer
      className="relative overflow-hidden border-t border-white/10 bg-ink text-white/85"
      style={footerStyle}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "url('/assets/pattern-flame.jpg')",
          backgroundSize: "220px",
          backgroundRepeat: "repeat",
        }}
      />
      <Container className="relative grid gap-12 sm:grid-cols-2 lg:grid-cols-4 py-16">
        <div className="flex flex-col items-start gap-3">
          <Image
            src="/assets/logo-reversed.jpg"
            alt="Intimate Sabbatical"
            width={220}
            height={110}
            className="w-[180px] rounded-2xl object-cover"
          />
          <span className="text-[11px] uppercase tracking-[0.18em] text-white/50">
            Sexual Wellness Education
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
            Services
          </h4>
          <Link href="/educational-consults" className="text-sm hover:text-coral">
            Educational Consults
          </Link>
          <Link href="/group-sessions" className="text-sm hover:text-coral">
            Group Sessions
          </Link>
          <Link href="/speaking-retreats" className="text-sm hover:text-coral">
            Speaking &amp; Retreats
          </Link>
          <Link href="/booking" className="text-sm hover:text-coral">
            Book a Consult
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
            Resources
          </h4>
          <Link href="/resources" className="text-sm hover:text-coral">
            All Resources
          </Link>
          <Link href="/blog" className="text-sm hover:text-coral">
            Blog
          </Link>
          <Link href="/videos" className="text-sm hover:text-coral">
            Videos
          </Link>
          <Link href="/faq" className="text-sm hover:text-coral">
            FAQ
          </Link>
          <Link href="/shop" className="text-sm hover:text-coral">
            Shop
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
            Connect
          </h4>
          <Link href="/contact" className="text-sm hover:text-coral">
            Contact
          </Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm hover:text-coral">
            {CONTACT_EMAIL}
          </a>
          <a href="#" className="text-sm hover:text-coral">
            Instagram
          </a>
          <a href="#" className="text-sm hover:text-coral">
            YouTube
          </a>
        </div>
      </Container>
      <div className="relative border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-[11px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Intimate Sabbatical</span>
          <span className="sm:text-center">
            Education only. Not a substitute for individualized medical diagnosis or treatment.
          </span>
          <Link href="/admin" className="text-white/30 transition-colors hover:text-white/60">
            Admin
          </Link>
        </Container>
      </div>
    </footer>
  );
}
