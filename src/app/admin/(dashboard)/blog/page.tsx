import { assertAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import StatusBanner from "@/components/admin/StatusBanner";
import { loadBlogPosts } from "./actions";

export default async function BlogListAdmin({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  await assertAdmin();
  const { status, error } = await searchParams;
  const { data: posts, error: loadError } = await loadBlogPosts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-sans text-2xl font-semibold text-burgundy">Blog Posts</h2>
        <Link
          href="/admin/blog/new"
          className="rounded-full bg-burgundy px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm transition-all hover:bg-burgundy-dark hover:shadow-md"
        >
          + New Post
        </Link>
      </div>

      <StatusBanner status={status as "draft" | "published" | "deleted"} error={error} />
      {loadError && (
        <div className="mb-6 rounded-xl border border-coral/25 bg-coral/5 p-4 text-sm text-ink/80">{loadError}</div>
      )}

      <div className="flex flex-col gap-3">
        {(posts ?? []).map((post) => (
          <Link
            key={post.documentId}
            href={`/admin/blog/${post.documentId}`}
            className="flex items-center justify-between rounded-xl border border-admin-border bg-white px-5 py-4 shadow-[0_1px_2px_rgba(25,27,34,0.04)] transition-colors hover:border-burgundy/40"
          >
            <div>
              <p className="text-sm font-medium text-ink">{post.title}</p>
              <p className="text-xs text-admin-muted">
                {post.category} &middot; /blog/{post.slug}
              </p>
            </div>
            <span className="text-xs text-admin-muted">{post.publishedDate}</span>
          </Link>
        ))}
        {posts?.length === 0 && (
          <p className="text-sm text-admin-muted">No posts yet. Create your first one.</p>
        )}
      </div>
    </div>
  );
}
