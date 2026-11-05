"use client";

import { useState } from "react";

export default function PasswordField({
  name,
  placeholder,
  autoFocus,
  required,
}: {
  name: string;
  placeholder?: string;
  autoFocus?: boolean;
  required?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        autoFocus={autoFocus}
        required={required}
        className="w-full rounded-xl border border-admin-border px-4 py-3 pr-14 text-[15px] outline-none transition-colors focus:border-burgundy focus:ring-4 focus:ring-burgundy/10"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-wide text-admin-muted hover:text-burgundy"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
