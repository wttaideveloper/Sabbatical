"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export default function ParallaxImage({
  src,
  className = "",
  objectPosition = "center",
  zoom = 1.12,
}: {
  src: string;
  className?: string;
  objectPosition?: string;
  zoom?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y, scale: zoom }}>
        <Image
          src={src}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`object-cover ${className}`}
          style={{ objectPosition }}
        />
      </motion.div>
    </div>
  );
}
