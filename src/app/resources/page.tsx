import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Resources",
  description: "Blog posts, videos, guides, and answers to common questions—all in one place.",
};

const RESOURCE_HUBS = [
  {
    href: "/blog",
    number: "01",
    title: "Blog",
    body: "Short, clinically grounded reads on hormones, pelvic health, and intimacy.",
  },
  {
    href: "/videos",
    number: "02",
    title: "Videos",
    body: "Watch the same topics explained in plain language, a few minutes at a time.",
  },
  {
    href: "/faq",
    number: "03",
    title: "FAQ",
    body: "Quick answers to what people usually want to know before booking.",
  },
  {
    href: "/shop",
    number: "04",
    title: "Shop",
    body: "Guides, workbooks, and courses to keep learning at your own pace.",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Everything in one place."
        lead="Reading, watching, or just looking for a quick answer—start here."
      />

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {RESOURCE_HUBS.map((hub, i) => (
              <Reveal key={hub.href} delay={(i % 2) * 80}>
                <Link
                  href={hub.href}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-10 transition-shadow hover:shadow-[0_24px_55px_-28px_rgba(28,21,23,0.28)]"
                >
                  <span className="mb-6 font-serif text-4xl text-coral">{hub.number}</span>
                  <h3 className="mb-3 text-2xl transition-colors group-hover:text-coral">
                    {hub.title}
                  </h3>
                  <p className="mb-8 text-[15px] leading-relaxed text-muted">{hub.body}</p>
                  <span className="mt-auto text-[11px] font-semibold uppercase tracking-[0.1em] text-burgundy">
                    Explore {hub.title} &rarr;
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        eyebrow="Ready When You Are"
        title="Prefer a real conversation?"
        body="Resources are a starting point—an educational consult is where the whole picture comes together."
        primaryCta={{ label: "Book a Consult", href: "/booking" }}
      />
    </>
  );
}
