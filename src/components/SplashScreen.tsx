"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const SPLASH_KEY = "is-splash-seen";
const EASE = [0.22, 1, 0.36, 1] as const;

export default function SplashScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem(SPLASH_KEY) === "1";
    } catch {
      seen = true;
    }

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduced) return;

    const showTimer = setTimeout(() => {
      try {
        sessionStorage.setItem(SPLASH_KEY, "1");
      } catch {}
      setShow(true);
    }, 0);
    const hideTimer = setTimeout(() => setShow(false), 1700);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-cream"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.7, ease: EASE, delay: 0.05 },
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, rgba(221,110,74,0.12), transparent 60%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE }}
          />

          <motion.div
            className="relative flex flex-col items-center"
            exit={{ scale: 0.96, transition: { duration: 0.6, ease: EASE } }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <Image
                src="/assets/logo-transparent.png"
                alt="Intimate Sabbatical"
                width={328}
                height={200}
                priority
                className="h-28 w-auto sm:h-36"
              />
            </motion.div>
            <motion.span
              className="mt-5 block h-px w-16 bg-coral"
              style={{ originX: 0 }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
