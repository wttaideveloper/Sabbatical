import { ReactNode } from "react";

export default function StickyFormActions({
  liveHref,
  previewPath,
  children,
}: {
  liveHref?: string;
  /** Public-site path (e.g. "/", "/about") to preview with draft content before publishing. */
  previewPath?: string;
  children: ReactNode;
}) {
  return (
    <div className="sticky bottom-0 -mx-6 mt-2 flex flex-wrap items-center gap-5 border-t border-admin-border bg-white/95 px-6 py-4 backdrop-blur sm:-mx-8 sm:px-8">
      {children}
      {previewPath && (
        <a
          href={`/admin/preview-panel?path=${encodeURIComponent(previewPath)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold uppercase tracking-wide text-burgundy hover:text-coral"
        >
          Preview &rarr;
        </a>
      )}
      {liveHref && (
        <a
          href={liveHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold uppercase tracking-wide text-burgundy hover:text-coral"
        >
          View Live Page &rarr;
        </a>
      )}
    </div>
  );
}
