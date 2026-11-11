"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "motion/react";
import { isExternalHref, safeHref } from "@/lib/safe-url";

type Variant = "primary" | "outline" | "cream" | "ghost-light";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-burgundy text-white border border-burgundy hover:bg-burgundy-dark hover:border-burgundy-dark",
  outline:
    "bg-transparent text-burgundy border border-burgundy hover:bg-burgundy hover:text-white",
  cream:
    "bg-cream text-burgundy border border-cream hover:bg-white",
  "ghost-light":
    "bg-transparent text-white border border-white/40 hover:border-white hover:bg-white/10",
};

const MotionLink = motion.create(Link);

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 ${VARIANT_CLASSES[variant]} ${className}`;

  // Admin-controlled links are validated here as well as on save: javascript:, data:,
  // file: and other unsafe targets never render as a button.
  const safe = safeHref(href);
  if (!safe) return null;

  const isExternal = isExternalHref(safe);
  const motionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const },
  };

  if (isExternal) {
    return (
      <motion.a href={safe} className={classes} {...motionProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <MotionLink href={safe} className={classes} {...motionProps}>
      {children}
    </MotionLink>
  );
}
