"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCart } from "./CartContext";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CartDrawer() {
  const { items, subtotal, removeItem, isOpen, close } = useCart();
  const [checkedOut, setCheckedOut] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[95] flex w-full max-w-sm flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h3 className="text-lg">Your Cart</h3>
              <button
                onClick={close}
                aria-label="Close cart"
                className="text-2xl leading-none text-muted hover:text-burgundy"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <p className="text-sm text-muted">Your cart is empty.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-4">
                      <div
                        className="h-16 w-16 shrink-0 rounded-xl"
                        style={{ background: product.swatch }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{product.name}</p>
                        <p className="text-xs text-muted">
                          Qty {quantity} &middot; ${product.price}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-xs uppercase tracking-wide text-muted hover:text-coral"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-line px-6 py-5">
              {checkedOut ? (
                <p className="rounded-xl bg-cream-soft p-4 text-sm text-ink/80">
                  This is a sample shop&mdash;no order was placed. Real checkout will process
                  through Fullscript once connected.
                </p>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-medium text-ink">${subtotal.toFixed(2)}</span>
                  </div>
                  <button
                    type="button"
                    disabled={items.length === 0}
                    onClick={() => setCheckedOut(true)}
                    className="w-full rounded-full bg-burgundy px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-burgundy-dark disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Checkout
                  </button>
                  <p className="mt-3 text-center text-xs text-muted">
                    Sample shop &mdash; no payment is processed.
                  </p>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
