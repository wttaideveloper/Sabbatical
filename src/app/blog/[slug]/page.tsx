import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { getBlogPostBySlug, toParagraphs } from "@/lib/strapi";
import { isWellFormedSlug } from "@/lib/slugs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isWellFormedSlug(slug)) return {};

  try {
    const post = await getBlogPostBySlug(slug);
    if (!post) return {};
    return {
      title: post.title,
      description: post.excerpt,
    };
  } catch {
    // CMS outage: the page render below surfaces the failure; metadata just stays generic.
    return {};
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Obviously invalid slugs never reach the CMS.
  if (!isWellFormedSlug(slug)) notFound();

  // Throws CmsUnavailableError on an outage (-> error boundary), returns null only
  // when the post genuinely doesn't exist (-> real 404, never a sample post).
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = toParagraphs(post.body);

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
            {post.category && <Eyebrow tone="coral">{post.category}</Eyebrow>}
            <h1 className="mb-4 text-4xl sm:text-5xl">{post.title}</h1>
            <div className="flex items-center gap-3 text-xs text-muted">
              {post.publishedDate && <span>{post.publishedDate}</span>}
              {post.publishedDate && post.readTime && <span>&middot;</span>}
              {post.readTime && <span>{post.readTime}</span>}
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
