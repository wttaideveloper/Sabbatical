"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function ServiceCard({
  number,
  title,
  body,
  note,
  href,
  linkLabel,
}: {
  number: string;
  title: string;
  body: string;
  note: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <motion.article
      className="flex min-h-[420px] flex-col rounded-2xl border border-line bg-white p-10 hover:shadow-[0_24px_55px_-28px_rgba(28,21,23,0.28)]"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="mb-6 font-serif text-4xl text-coral">{number}</span>
      <h3 className="mb-4">{title}</h3>
      <p className="mb-5 text-[15px] leading-relaxed text-muted">{body}</p>
      <p className="mb-8 text-sm font-medium text-burgundy">{note}</p>
      <Link
        href={href}
        className="mt-auto text-[11px] font-semibold uppercase tracking-[0.1em] text-burgundy transition-colors hover:text-coral"
      >
        {linkLabel} →
      </Link>
    </motion.article>
  );
}
