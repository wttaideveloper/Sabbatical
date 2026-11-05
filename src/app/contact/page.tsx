import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { CONTACT_EMAIL } from "@/lib/nav-links";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with questions about consults, group sessions, or speaking inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's start a conversation."
        lead="Questions about a consult, a group series, or a speaking invitation? Send a note and we'll follow up directly."
      />

      <section className="py-16 sm:py-24">
        <Container className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <Eyebrow tone="coral">Direct</Eyebrow>
            <h2 className="mb-6 text-3xl sm:text-4xl">Reach out any time.</h2>
            <div className="flex flex-col gap-4 text-sm text-ink/80">
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-burgundy hover:text-coral">
                {CONTACT_EMAIL}
              </a>
              <p className="leading-relaxed text-muted">
                Typical response time is within two business days. For time-sensitive scheduling,
                use the Book a Consult flow instead.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <ContactForm />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
