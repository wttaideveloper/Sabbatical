"use client";

import { useFormStatus } from "react-dom";

export default function SaveButton({ label = "Save Changes" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-burgundy px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-sm transition-all hover:bg-burgundy-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}
