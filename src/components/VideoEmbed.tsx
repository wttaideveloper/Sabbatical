import { parseVideoUrl } from "@/lib/safe-url";

/**
 * Renders a video from an admin-supplied URL, but only if it is one of:
 *   - a YouTube or Vimeo https:// link (re-built from a validated video ID), or
 *   - a video file uploaded to this site's own CMS.
 * Anything else renders nothing — the stored value is never echoed into an iframe/src
 * unchecked, so a javascript:/data: URL or an arbitrary third-party page can't be embedded.
 */
export default function VideoEmbed({ url, title = "Video" }: { url: string; title?: string }) {
  const video = parseVideoUrl(url);
  if (!video) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-ink">
      <div className="relative aspect-video w-full">
        {video.kind === "file" ? (
          <video
            src={video.src}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <iframe
            src={video.src}
            title={title}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}
