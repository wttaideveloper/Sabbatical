"use client";

import { useState } from "react";
import { CONTACT_EMAIL } from "@/lib/nav-links";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const canSubmit = form.name && form.email && form.message;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const body = `${form.message}\n\n—\n${form.name}\n${form.email}`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      form.subject || "Website Inquiry"
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-line bg-cream-soft p-8 text-center">
        <h3 className="mb-2 text-xl">Opening your email client&hellip;</h3>
        <p className="text-sm text-muted">
          If nothing happened, email us directly at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-burgundy hover:text-coral">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-5 text-xs font-semibold uppercase tracking-[0.1em] text-burgundy hover:text-coral"
        >
          &larr; Edit and resend
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          required
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-burgundy"
        />
        <input
          type="email"
          required
          placeholder="Email address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-burgundy"
        />
      </div>
      <input
        type="text"
        placeholder="Subject (optional)"
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
        className="rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-burgundy"
      />
      <textarea
        required
        placeholder="What's on your mind?"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        rows={6}
        className="rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-burgundy"
      />
      <button
        type="submit"
        disabled={!canSubmit}
        className="self-start rounded-full bg-burgundy px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-burgundy-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        Send Message
      </button>
      <p className="text-xs text-muted">
        This form opens your email client to send&mdash;nothing is stored on our end.
      </p>
    </form>
  );
}
