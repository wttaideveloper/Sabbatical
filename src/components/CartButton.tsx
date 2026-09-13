"use client";

import { motion } from "motion/react";
import { useCart } from "./CartContext";

export default function CartButton() {
  const { count, open } = useCart();

  return (
    <motion.button
      type="button"
      onClick={open}
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative flex h-9 w-9 items-center justify-center text-ink"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.2 }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 6h15l-1.5 9h-12z" />
        <path d="M6 6l-1-3H2" />
        <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-coral text-[9px] font-semibold text-white">
          {count}
        </span>
      )}
    </motion.button>
  );
}
