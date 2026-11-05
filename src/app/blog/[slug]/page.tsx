import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { getBlogPostBySlug, toParagraphs } from "@/lib/strapi";

const FALLBACK = {
  category: "Perimenopause",
  title: "Why Desire Changes Before Anything Else Does",
  date: "March 12, 2026",
  readTime: "6 min read",
  body: "This is a sample post used to preview the blog template—the content below is illustrative, not published editorial.\n\nLong before a missed period or a hot flash ever shows up, many women notice something quieter: sex just doesn't feel the same. Desire that used to arrive on its own seems to have gone somewhere else. Arousal takes longer, or doesn't quite arrive at all.\n\nEstrogen and progesterone get most of the attention, but testosterone—yes, women produce it too—plays an outsized role in desire, sensation, and energy. Its decline is gradual and easy to miss, which is exactly why the first sign is often felt rather than measured.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  return {
    title: post?.title || FALLBACK.title,
    description: post?.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  const category = post?.category || FALLBACK.category;
  const title = post?.title || FALLBACK.title;
  const date = post?.publishedDate || FALLBACK.date;
  const readTime = post?.readTime || FALLBACK.readTime;
  const paragraphs = toParagraphs(post?.body || FALLBACK.body);

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
            <Eyebrow tone="coral">{category}</Eyebrow>
            <h1 className="mb-4 text-4xl sm:text-5xl">{title}</h1>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span>{date}</span>
              <span>&middot;</span>
              <span>{readTime}</span>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-lg leading-relaxed text-ink/85">
            {paragraphs.map((p, i) => (
              <p key={i} className="mb-6 last:mb-0">
                {p}
              </p>
            ))}
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
