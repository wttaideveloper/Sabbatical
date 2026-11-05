import Link from "next/link";
import ViewportToggle from "@/components/admin/ViewportToggle";

export default async function PreviewPanelPage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string }>;
}) {
  const { path } = await searchParams;
  const targetPath = path && path.startsWith("/") && !path.startsWith("//") ? path : "/";

  return (
    <div className="flex min-h-screen flex-col bg-admin-bg">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-admin-border bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="font-serif text-lg text-burgundy">Preview</span>
          <span className="rounded-full bg-admin-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-admin-muted">
            Draft
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ViewportToggle />
          <Link
            href="/admin/preview/disable"
            prefetch={false}
            className="text-xs font-semibold uppercase tracking-wide text-admin-muted transition-colors hover:text-coral"
          >
            Exit Preview
          </Link>
        </div>
      </header>
      <div className="flex flex-1 items-start justify-center overflow-auto p-6">
        <iframe
          id="preview-frame"
          src={`/admin/preview?path=${encodeURIComponent(targetPath)}`}
          title="Draft preview"
          className="h-[calc(100vh-140px)] w-full max-w-[1400px] rounded-2xl border border-admin-border bg-white shadow-lg transition-[width] duration-300"
        />
      </div>
    </div>
  );
}
