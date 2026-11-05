"use client";

import { useState } from "react";

const SIZES = { desktop: "100%", tablet: "768px", mobile: "375px" } as const;
type Size = keyof typeof SIZES;

export default function ViewportToggle() {
  const [active, setActive] = useState<Size>("desktop");

  function setSize(size: Size) {
    setActive(size);
    const frame = document.getElementById("preview-frame");
    if (frame) frame.style.width = SIZES[size];
  }

  return (
    <div className="inline-flex rounded-full border border-admin-border bg-admin-bg p-1">
      {(Object.keys(SIZES) as Size[]).map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => setSize(size)}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
            active === size ? "bg-white text-burgundy shadow-sm" : "text-admin-muted hover:text-ink"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
