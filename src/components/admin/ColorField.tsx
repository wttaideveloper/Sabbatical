"use client";

import { useState } from "react";

export default function ColorField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const swatch = /^#[0-9A-Fa-f]{6}$/.test(value) ? value : "#ffffff";

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold uppercase tracking-[0.06em] text-admin-muted">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={swatch}
          onChange={(e) => setValue(e.target.value)}
          aria-label={`${label} swatch`}
          className="h-11 w-11 shrink-0 cursor-pointer rounded-lg border border-admin-border bg-white p-1"
        />
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Site default"
          className="w-full rounded-xl border border-admin-border bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-burgundy focus:ring-4 focus:ring-burgundy/10"
        />
      </div>
    </label>
  );
}
