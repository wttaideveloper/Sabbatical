"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useCart } from "./CartContext";
import type { Product } from "@/lib/dummy-data";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.article
      className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="h-44 w-full" style={{ background: product.swatch }} />
      <div className="flex flex-1 flex-col p-6">
        <span className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-coral">
          {product.category}
        </span>
        <h3 className="mb-2 text-xl">{product.name}</h3>
        <p className="mb-5 text-sm leading-relaxed text-muted">{product.blurb}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-medium text-burgundy">${product.price}</span>
          <button
            type="button"
            onClick={handleAdd}
            className={`rounded-full border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${
              added
                ? "border-burgundy bg-burgundy text-white"
                : "border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
            }`}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
