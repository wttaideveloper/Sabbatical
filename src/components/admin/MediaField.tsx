"use client";

import { useState } from "react";

type Kind = "image" | "video";

export default function MediaField({
  name,
  label,
  currentUrl,
  kind = "image",
  hint,
}: {
  name: string;
  label: string;
  currentUrl?: string;
  kind?: Kind;
  hint?: string;
}) {
  const isVideo = kind === "video";
  // Video fields today store a plain URL (often a pasted YouTube/Vimeo link), so
  // that's the more useful default tab; image fields default to upload, matching
  // how they behaved before this component existed.
  const [mode, setMode] = useState<"upload" | "link">(isVideo ? "link" : "upload");
  const [preview, setPreview] = useState<string | undefined>(currentUrl);
  const [linkValue, setLinkValue] = useState(isVideo ? currentUrl ?? "" : "");

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[13px] font-semibold uppercase tracking-[0.06em] text-admin-muted">{label}</span>

      <div className="inline-flex w-fit rounded-full border border-admin-border bg-admin-bg p-1">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            mode === "upload" ? "bg-white text-burgundy shadow-sm" : "text-admin-muted hover:text-ink"
          }`}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setMode("link")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            mode === "link" ? "bg-white text-burgundy shadow-sm" : "text-admin-muted hover:text-ink"
          }`}
        >
          Use a Link
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div
          className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-admin-border bg-admin-bg ${
            isVideo ? "h-28 w-48" : "h-20 w-20"
          }`}
        >
          {mode === "upload" && preview ? (
            isVideo ? (
              <video src={preview} muted controls className="h-full w-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-cover" />
            )
          ) : mode === "link" && linkValue && !isVideo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={linkValue}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          ) : (
            <span className="px-2 text-center text-[10px] leading-snug text-admin-muted">
              {mode === "link" ? "Link preview" : isVideo ? "No video yet" : "No image yet"}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {mode === "upload" ? (
            <input
              type="file"
              name={name}
              accept={isVideo ? "video/*" : "image/*"}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
              className="w-full text-xs text-admin-muted file:mr-3 file:rounded-full file:border file:border-burgundy file:bg-white file:px-4 file:py-2 file:text-[11px] file:font-semibold file:uppercase file:tracking-wide file:text-burgundy hover:file:bg-burgundy hover:file:text-white"
            />
          ) : (
            <input
              type="text"
              name={`${name}Link`}
              defaultValue={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              placeholder={isVideo ? "https://youtube.com/watch?v=..." : "https://example.com/photo.jpg"}
              className="w-full rounded-xl border border-admin-border bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-burgundy focus:ring-4 focus:ring-burgundy/10"
            />
          )}
          {hint && <p className="mt-1.5 text-xs text-admin-muted">{hint}</p>}
        </div>
      </div>
    </div>
  );
}
