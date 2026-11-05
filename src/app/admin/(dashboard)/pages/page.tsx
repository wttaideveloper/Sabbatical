import Link from "next/link";
import StatusBanner from "@/components/admin/StatusBanner";
import { loadPages } from "./actions";

export default async function PagesListAdmin({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  const { status, error } = await searchParams;
  const { data: pages, error: loadError } = await loadPages();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-sans text-2xl font-semibold text-burgundy">Pages</h2>
          <p className="text-sm text-admin-muted">Build brand-new pages from scratch, published at their own URL.</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="rounded-full bg-burgundy px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm transition-all hover:bg-burgundy-dark hover:shadow-md"
        >
          + New Page
        </Link>
      </div>

      <StatusBanner status={status as "draft" | "published" | "deleted"} error={error} />
      {loadError && (
        <div className="mb-6 rounded-xl border border-coral/25 bg-coral/5 p-4 text-sm text-ink/80">{loadError}</div>
      )}

      <div className="flex flex-col gap-3">
        {(pages ?? []).map((page) => (
          <Link
            key={page.documentId}
            href={`/admin/pages/${page.documentId}`}
            className="flex items-center justify-between rounded-xl border border-admin-border bg-white px-5 py-4 shadow-[0_1px_2px_rgba(25,27,34,0.04)] transition-colors hover:border-burgundy/40"
          >
            <div>
              <p className="text-sm font-medium text-ink">{page.title}</p>
              <p className="text-xs text-admin-muted">/{page.slug}</p>
            </div>
            <span className="text-xs text-admin-muted">{page.sections?.length ?? 0} section{page.sections?.length === 1 ? "" : "s"}</span>
          </Link>
        ))}
        {pages?.length === 0 && (
          <p className="text-sm text-admin-muted">
            No custom pages yet. Click &ldquo;+ New Page&rdquo; to build your first one.
          </p>
        )}
      </div>
    </div>
  );
}
