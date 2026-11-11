import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import StatusNotice, { CmsUnavailableNotice } from "@/components/StatusNotice";
import { CmsUnavailableError, getBlogPosts, type BlogPost } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on sexual health, hormones, pelvic health, and midlife wellness.",
};

/** Only real, published CMS posts are ever listed. An outage is reported as such. */
async function loadPosts(): Promise<{ posts: BlogPost[]; unavailable: boolean }> {
  try {
    return { posts: await getBlogPosts(), unavailable: false };
  } catch (err) {
    if (err instanceof CmsUnavailableError) {
      console.error(`[cms] ${err.message}`);
      return { posts: [], unavailable: true };
    }
    throw err;
  }
}

export default async function BlogPage() {
  const { posts, unavailable } = await loadPosts();

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Notes worth reading slowly."
        lead="Short, clinically grounded reads on the biology and psychology behind changes in desire, comfort, and intimacy."
      />

      {unavailable ? (
        <CmsUnavailableNotice />
      ) : posts.length === 0 ? (
        <StatusNotice eyebrow="Blog" title="New writing is on the way.">
          <p>There are no posts published yet. Please check back soon.</p>
        </StatusNotice>
      ) : (
        <section className="py-16 sm:py-24">
          <Container>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.documentId} delay={(i % 3) * 80}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-white p-8 transition-shadow hover:shadow-[0_24px_55px_-28px_rgba(28,21,23,0.28)]"
                  >
                    <span className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-coral">
                      {post.category || ""}
                    </span>
                    <h3 className="mb-3 text-xl transition-colors group-hover:text-coral">
                      {post.title}
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed text-muted">{post.excerpt || ""}</p>
                    <div className="mt-auto flex items-center justify-between text-xs text-muted">
                      <span>{post.publishedDate || ""}</span>
                      <span>{post.readTime || ""}</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
