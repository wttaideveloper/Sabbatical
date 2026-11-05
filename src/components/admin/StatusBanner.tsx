export default function StatusBanner({
  status,
  error,
}: {
  status?: "draft" | "published" | "deleted";
  error?: string;
}) {
  if (error) {
    return (
      <div className="mb-6 rounded-xl border border-coral/25 bg-coral/5 px-4 py-3.5 text-sm text-ink/80">
        <strong className="text-coral">Couldn&apos;t save:</strong> {decodeURIComponent(error)}
      </div>
    );
  }
  if (status === "published") {
    return (
      <div className="mb-6 rounded-xl border border-burgundy/20 bg-burgundy/5 px-4 py-3.5 text-sm font-medium text-burgundy">
        Published — the live site reflects this change now.
      </div>
    );
  }
  if (status === "draft") {
    return (
      <div className="mb-6 rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-ink">
        Saved as a draft. Preview it, then click <strong>Publish Live</strong> when you&apos;re ready for visitors to see it.
      </div>
    );
  }
  if (status === "deleted") {
    return (
      <div className="mb-6 rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm text-ink/80">
        Deleted.
      </div>
    );
  }
  return null;
}
