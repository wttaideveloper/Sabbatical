"use client";

import Image from "next/image";
import { motion } from "motion/react";
import Container from "./Container";
import Eyebrow from "./Eyebrow";
import Button from "./Button";
import { Stagger, StaggerItem } from "./Stagger";
import { fontFamilyCssVar } from "@/lib/font-options";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function PageHero({
  eyebrow,
  title,
  lead,
  cta,
  photo,
  backgroundColor,
  textColor,
  fontFamily,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  cta?: { label: string; href: string };
  photo?: string;
  /** Admin-set hero theming overrides — all optional, undefined when unset so every
   *  page using PageHero without them (shop, blog, faq, etc.) keeps today's fixed look. */
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
}) {
  const sectionStyle = backgroundColor ? { background: backgroundColor } : undefined;
  const titleStyle = { color: textColor || undefined, fontFamily: fontFamilyCssVar(fontFamily) };

  if (photo) {
    return (
      <section className="relative overflow-hidden border-b border-line" style={sectionStyle}>
        <div className="relative h-[340px] sm:hidden">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 12, ease: EASE }}
          >
            <Image
              src={photo}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[center_18%]"
              priority
            />
          </motion.div>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-cream" />
        </div>
        <div className="absolute inset-0 hidden overflow-hidden sm:block">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 14, ease: EASE }}
          >
            <Image
              src={photo}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[72%_18%]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/85 to-cream/10" />
        </div>
        <Container className="relative flex items-center py-14 sm:min-h-[600px] sm:py-24">
          <Stagger className="max-w-xl">
            <StaggerItem>
              <Eyebrow>{eyebrow}</Eyebrow>
            </StaggerItem>
            <StaggerItem>
              <h1
                className="mb-6 font-serif text-4xl font-medium leading-[1.05] text-burgundy sm:text-5xl lg:text-6xl"
                style={titleStyle}
              >
                {title}
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="text-lg leading-relaxed text-ink/80 sm:text-xl">{lead}</p>
            </StaggerItem>
          </Stagger>
        </Container>
      </section>
    );
  }

  return (
    <section
      className="border-b border-line bg-gradient-to-br from-white via-cream to-[#f2e4dd]"
      style={sectionStyle}
    >
      <Container className="flex items-center py-16 sm:min-h-[480px] sm:py-24">
        <Stagger className="max-w-2xl">
          <StaggerItem>
            <Eyebrow>{eyebrow}</Eyebrow>
          </StaggerItem>
          <StaggerItem>
            <h1
              className="mb-6 font-serif text-4xl font-medium leading-[1.05] text-burgundy sm:text-5xl lg:text-6xl"
              style={titleStyle}
            >
              {title}
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-ink/80 sm:text-xl">{lead}</p>
            {cta && <Button href={cta.href}>{cta.label}</Button>}
          </StaggerItem>
        </Stagger>
      </Container>
    </section>
  );
}
