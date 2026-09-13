import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Why Desire Changes Before Anything Else Does",
  description:
    "For many women, a dip in desire is the very first sign that hormones are shifting.",
};

export default function SamplePostPage() {
  return (
    <>
      <section className="border-b border-line bg-gradient-to-br from-white via-cream to-[#f2e4dd]">
        <Container className="py-16 sm:py-24">
          <Reveal className="mx-auto max-w-2xl">
            <Link
              href="/blog"
              className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.1em] text-burgundy hover:text-coral"
            >
              &larr; Back to Blog
            </Link>
            <Eyebrow tone="coral">Perimenopause</Eyebrow>
            <h1 className="mb-4 text-4xl sm:text-5xl">
              Why Desire Changes Before Anything Else Does
            </h1>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span>March 12, 2026</span>
              <span>&middot;</span>
              <span>6 min read</span>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-lg leading-relaxed text-ink/85">
            <p className="mb-6">
              <em>This is a sample post used to preview the blog template&mdash;the content below
              is illustrative, not published editorial.</em>
            </p>
            <p className="mb-6">
              Long before a missed period or a hot flash ever shows up, many women notice something
              quieter: sex just doesn&rsquo;t feel the same. Desire that used to arrive on its own
              seems to have gone somewhere else. Arousal takes longer, or doesn&rsquo;t quite
              arrive at all.
            </p>
            <p className="mb-6">
              It&rsquo;s tempting to read that as a relationship problem, a stress problem, or a
              &ldquo;just not in the mood lately&rdquo; problem. Sometimes it is. But for many
              women in their late 30s and 40s, this is one of the very first biological signals of
              perimenopause&mdash;arriving years before cycles become irregular.
            </p>
            <h2 className="mb-4 mt-10 text-3xl">The hormone doing the quiet work</h2>
            <p className="mb-6">
              Estrogen and progesterone get most of the attention, but testosterone&mdash;yes,
              women produce it too&mdash;plays an outsized role in desire, sensation, and energy.
              Its decline is gradual and easy to miss, which is exactly why the first sign is often
              felt rather than measured.
            </p>
            <p className="mb-6">
              Understanding this timeline changes the question. Instead of &ldquo;what&rsquo;s
              wrong with me,&rdquo; the more useful question becomes &ldquo;what season is my body
              actually in, and what does that season need?&rdquo;
            </p>
          </Reveal>
        </Container>
      </section>

      <CtaBand
        eyebrow="Want the Whole Picture"
        title="A consult connects the dots this post can't."
        layout="center"
        primaryCta={{ label: "Book a Consult", href: "/booking" }}
        secondaryCtas={[{ label: "Back to Blog", href: "/blog" }]}
      />
    </>
  );
}
