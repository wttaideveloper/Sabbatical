import Container from "./Container";
import Eyebrow from "./Eyebrow";
import Button from "./Button";
import Reveal from "./Reveal";
import { ReactNode } from "react";

export default function CtaBand({
  id,
  eyebrow,
  title,
  body,
  primaryCta,
  secondaryCtas,
  layout = "split",
}: {
  id?: string;
  eyebrow: string;
  title: string;
  body?: string;
  primaryCta: { label: string; href: string };
  secondaryCtas?: { label: string; href: string }[];
  layout?: "split" | "center";
}) {
  const content: ReactNode = (
    <>
      <Eyebrow tone="light">{eyebrow}</Eyebrow>
      <h2 className="mb-4 font-serif text-4xl font-medium text-white sm:text-5xl">{title}</h2>
      {body && <p className="max-w-2xl text-white/75">{body}</p>}
    </>
  );

  return (
    <section id={id} className="relative overflow-hidden bg-burgundy-dark py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(221,110,74,0.18), transparent 55%)",
        }}
      />
      <Container className="relative">
        {layout === "center" ? (
          <Reveal className="flex flex-col items-center gap-8 text-center">
            {content}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button href={primaryCta.href} variant="cream">
                {primaryCta.label}
              </Button>
              {secondaryCtas?.map((cta) => (
                <Button key={cta.href} href={cta.href} variant="ghost-light">
                  {cta.label}
                </Button>
              ))}
            </div>
          </Reveal>
        ) : (
          <Reveal className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
            <div>{content}</div>
            <Button href={primaryCta.href} variant="cream" className="shrink-0">
              {primaryCta.label}
            </Button>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
