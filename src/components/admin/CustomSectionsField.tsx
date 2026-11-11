"use client";

import { useState } from "react";
import ReorderableList from "./ReorderableList";
import MediaField from "./MediaField";
import { FONT_OPTIONS } from "@/lib/font-options";
import { strapiImageUrl, type StrapiMedia } from "@/lib/cms-media";

export type CustomSectionValue = {
  key: string;
  blockType?: string;
  heading?: string;
  body?: string;
  image?: StrapiMedia | null;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  layout?: string;
  ctaLabel?: string;
  ctaHref?: string;
  attribution?: string;
  videoUrl?: string;
};

const BLOCK_TYPE_OPTIONS = [
  { value: "text", label: "Text & Image" },
  { value: "cta", label: "Call to Action" },
  { value: "quote", label: "Quote" },
  { value: "video", label: "Video" },
] as const;

let counter = 0;
function newKey() {
  counter += 1;
  return `new-${Date.now()}-${counter}`;
}

const inputClass =
  "w-full rounded-lg border border-admin-border bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-burgundy focus:ring-4 focus:ring-burgundy/10";
const swatchClass = "h-10 w-full cursor-pointer rounded-lg border border-admin-border bg-white p-1";
const microLabel = "text-[11px] font-semibold uppercase tracking-wide text-admin-muted";

export default function CustomSectionsField({
  name,
  initialItems,
}: {
  name: string;
  initialItems: Omit<CustomSectionValue, "key">[];
}) {
  const [items, setItems] = useState<CustomSectionValue[]>(() =>
    initialItems.map((i) => ({ ...i, key: newKey() }))
  );

  const update = (key: string, field: keyof CustomSectionValue, value: string) => {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, [field]: value } : it)));
  };

  const remove = (key: string) => {
    setItems((prev) => prev.filter((it) => it.key !== key));
  };

  const add = () => {
    setItems((prev) => [...prev, { key: newKey(), blockType: "text", layout: "image-right" }]);
  };

  return (
    <div className="flex flex-col gap-4">
      {items.length > 0 && (
        <ReorderableList
          id={name}
          items={items}
          getId={(item) => item.key}
          onReorder={setItems}
          renderItem={(item, index, dragHandle) => {
            const blockType = item.blockType || "text";
            return (
              <div className="rounded-xl border border-admin-border bg-admin-bg p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {dragHandle}
                    <select
                      defaultValue={blockType}
                      onChange={(e) => update(item.key, "blockType", e.target.value)}
                      className="rounded-full border border-admin-border bg-white px-3 py-1.5 text-xs font-semibold text-ink outline-none focus:border-burgundy"
                    >
                      {BLOCK_TYPE_OPTIONS.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.key)}
                    className="text-[11px] font-semibold uppercase tracking-wide text-admin-muted hover:text-coral"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {blockType !== "quote" && (
                    <input
                      placeholder={blockType === "video" ? "Video Title" : "Heading"}
                      defaultValue={item.heading}
                      onChange={(e) => update(item.key, "heading", e.target.value)}
                      className={inputClass}
                    />
                  )}

                  <textarea
                    placeholder={blockType === "quote" ? "Quote text" : blockType === "video" ? "Caption (optional)" : "Body"}
                    defaultValue={item.body}
                    onChange={(e) => update(item.key, "body", e.target.value)}
                    rows={3}
                    className={inputClass}
                  />

                  {blockType === "quote" && (
                    <input
                      placeholder="Attribution (e.g. a name and title)"
                      defaultValue={item.attribution}
                      onChange={(e) => update(item.key, "attribution", e.target.value)}
                      className={inputClass}
                    />
                  )}

                  {blockType === "cta" && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        placeholder="Button Label"
                        defaultValue={item.ctaLabel}
                        onChange={(e) => update(item.key, "ctaLabel", e.target.value)}
                        className={inputClass}
                      />
                      <input
                        placeholder="Button Link (e.g. /booking)"
                        defaultValue={item.ctaHref}
                        onChange={(e) => update(item.key, "ctaHref", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  )}

                  {blockType === "video" && (
                    <input
                      placeholder="YouTube or Vimeo link, e.g. https://youtube.com/watch?v=..."
                      defaultValue={item.videoUrl}
                      onChange={(e) => update(item.key, "videoUrl", e.target.value)}
                      className={inputClass}
                    />
                  )}

                  {blockType === "text" && (
                    <>
                      <MediaField
                        name={`${name}__${index}__image`}
                        label="Image"
                        currentUrl={strapiImageUrl(item.image)}
                      />
                      <label className="flex flex-col gap-1">
                        <span className={microLabel}>Layout</span>
                        <select
                          defaultValue={item.layout ?? "image-right"}
                          onChange={(e) => update(item.key, "layout", e.target.value)}
                          className={inputClass}
                        >
                          <option value="image-right">Image Right</option>
                          <option value="image-left">Image Left</option>
                          <option value="image-top">Image Top</option>
                          <option value="text-only">Text Only</option>
                        </select>
                      </label>
                    </>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-1">
                      <span className={microLabel}>Background</span>
                      <input
                        type="color"
                        defaultValue={/^#[0-9A-Fa-f]{6}$/.test(item.backgroundColor ?? "") ? item.backgroundColor : "#ffffff"}
                        onChange={(e) => update(item.key, "backgroundColor", e.target.value)}
                        className={swatchClass}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className={microLabel}>Text Color</span>
                      <input
                        type="color"
                        defaultValue={/^#[0-9A-Fa-f]{6}$/.test(item.textColor ?? "") ? item.textColor : "#1c1517"}
                        onChange={(e) => update(item.key, "textColor", e.target.value)}
                        className={swatchClass}
                      />
                    </label>
                  </div>
                  <label className="flex flex-col gap-1">
                    <span className={microLabel}>Font</span>
                    <select
                      defaultValue={item.fontFamily ?? ""}
                      onChange={(e) => update(item.key, "fontFamily", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Site Default</option>
                      {FONT_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {/* Hidden inputs mirror state so native form submission carries this row's values in its current position */}
                <input type="hidden" name={`${name}__${index}__blockType`} value={blockType} readOnly />
                <input type="hidden" name={`${name}__${index}__heading`} value={item.heading ?? ""} readOnly />
                <input type="hidden" name={`${name}__${index}__body`} value={item.body ?? ""} readOnly />
                <input
                  type="hidden"
                  name={`${name}__${index}__backgroundColor`}
                  value={item.backgroundColor ?? ""}
                  readOnly
                />
                <input type="hidden" name={`${name}__${index}__textColor`} value={item.textColor ?? ""} readOnly />
                <input type="hidden" name={`${name}__${index}__fontFamily`} value={item.fontFamily ?? ""} readOnly />
                <input type="hidden" name={`${name}__${index}__layout`} value={item.layout ?? ""} readOnly />
                <input type="hidden" name={`${name}__${index}__ctaLabel`} value={item.ctaLabel ?? ""} readOnly />
                <input type="hidden" name={`${name}__${index}__ctaHref`} value={item.ctaHref ?? ""} readOnly />
                <input type="hidden" name={`${name}__${index}__attribution`} value={item.attribution ?? ""} readOnly />
                <input type="hidden" name={`${name}__${index}__videoUrl`} value={item.videoUrl ?? ""} readOnly />
              </div>
            );
          }}
        />
      )}
      <button
        type="button"
        onClick={add}
        className="self-start rounded-full border border-burgundy px-5 py-2 text-[11px] font-semibold uppercase tracking-wide text-burgundy transition-colors hover:bg-burgundy hover:text-white"
      >
        + Add Section
      </button>
    </div>
  );
}
