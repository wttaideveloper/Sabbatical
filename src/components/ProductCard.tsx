"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { CONTACT_EMAIL } from "@/lib/nav-links";

export type ProductCardData = {
  id: string;
  name: string;
  category: string;
  price: number;
  blurb: string;
  /** CSS gradient shown when the product has no image. */
  swatch: string;
  imageUrl?: string;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <motion.article
      className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {product.imageUrl ? (
        <div className="relative h-44 w-full">
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
        </div>
      ) : (
        <div className="h-44 w-full" style={{ background: product.swatch }} />
      )}
      <div className="flex flex-1 flex-col p-6">
        <span className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-coral">
          {product.category}
        </span>
        <h3 className="mb-2 text-xl">{product.name}</h3>
        <p className="mb-5 text-sm leading-relaxed text-muted">{product.blurb}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-medium text-burgundy">${product.price}</span>
          <Link
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(product.name)}`}
            className="rounded-full border border-burgundy px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-burgundy transition-colors hover:bg-burgundy hover:text-white"
          >
            Inquire
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
