"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

export default function PublishButton({
  formAction,
  label = "Publish Live",
}: {
  formAction: (formData: FormData) => void;
  label?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const { pending } = useFormStatus();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-full border border-burgundy px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-burgundy transition-colors hover:bg-burgundy hover:text-white"
      >
        {label}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-full border border-burgundy/25 bg-burgundy/5 py-1.5 pl-4 pr-1.5">
      <span className="text-xs font-medium text-ink">Publish live now?</span>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-xs font-semibold uppercase tracking-wide text-admin-muted hover:text-ink"
      >
        Cancel
      </button>
      <button
        type="submit"
        formAction={formAction}
        disabled={pending}
        className="rounded-full bg-burgundy px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-burgundy-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Publishing…" : "Confirm"}
      </button>
    </div>
  );
}
