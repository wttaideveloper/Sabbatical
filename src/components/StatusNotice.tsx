import type { ReactNode } from "react";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import { CONTACT_EMAIL } from "@/lib/public-config";

/**
 * Honest empty / unavailable state for CMS-backed sections. It replaces the old
 * fabricated fallbacks (sample blog posts, invented products and prices, made-up
 * appointment times): visitors are told plainly that nothing is available to show.
 */
export default function StatusNotice({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-white p-8 text-center sm:p-12">
          <Eyebrow className="mx-auto justify-center">{eyebrow}</Eyebrow>
          <h2 className="mb-4 text-2xl sm:text-3xl">{title}</h2>
          {children && <div className="text-sm leading-relaxed text-muted sm:text-base">{children}</div>}
        </div>
      </Container>
    </section>
  );
}

function ContactLine() {
  return (
    <>
      Email us at{" "}
      <a href={`mailto:${CONTACT_EMAIL}`} className="text-burgundy hover:text-coral">
        {CONTACT_EMAIL}
      </a>{" "}
      and we&rsquo;ll help directly.
    </>
  );
}

/** Shown when the CMS can't be reached (a real outage, distinct from "no content yet"). */
export function CmsUnavailableNotice() {
  return (
    <StatusNotice eyebrow="Temporarily unavailable" title="This content isn't available right now.">
      <p>
        We&rsquo;re having trouble loading it. Please try again in a few minutes. <ContactLine />
      </p>
    </StatusNotice>
  );
}
