"use client";

import { useEffect } from "react";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import { CONTACT_EMAIL } from "@/lib/public-config";

/**
 * Shown when a page throws — most importantly when required content can't be loaded from
 * the CMS or configuration is missing. Failures are made visible instead of being papered
 * over with fabricated content.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <Eyebrow className="mx-auto justify-center">Something went wrong</Eyebrow>
          <h1 className="mb-4 text-4xl sm:text-5xl">This page isn&rsquo;t available right now.</h1>
          <p className="mb-8 text-lg leading-relaxed text-ink/80">
            We couldn&rsquo;t load this page. Please try again in a moment, or email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-burgundy hover:text-coral">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-burgundy bg-burgundy px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-burgundy-dark"
          >
            Try Again
          </button>
        </div>
      </Container>
    </section>
  );
}
