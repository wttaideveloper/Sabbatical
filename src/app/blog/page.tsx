import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { getBlogPosts } from "@/lib/strapi";
import { BLOG_POSTS } from "@/lib/dummy-data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on sexual health, hormones, pelvic health, and midlife wellness.",
};

export default async function BlogPage() {
  const cmsPosts = await getBlogPosts();
  const posts = cmsPosts.length
    ? cmsPosts.map((p) => ({
        slug: p.slug,
        category: p.category || "",
        title: p.title,
        excerpt: p.excerpt || "",
        date: p.publishedDate || "",
        readTime: p.readTime || "",
      }))
    : BLOG_POSTS;

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Notes worth reading slowly."
        lead="Short, clinically grounded reads on the biology and psychology behind changes in desire, comfort, and intimacy."
      />

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={`${post.slug}-${i}`} delay={(i % 3) * 80}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-8 transition-shadow hover:shadow-[0_24px_55px_-28px_rgba(28,21,23,0.28)]"
                >
                  <span className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-coral">
                    {post.category}
                  </span>
                  <h3 className="mb-3 text-xl transition-colors group-hover:text-coral">
                    {post.title}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between text-xs text-muted">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
