import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Accordion, { AccordionItem } from "@/components/Accordion";
import CtaBand from "@/components/CtaBand";
import { CONTACT_EMAIL } from "@/lib/public-config";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about consults, group sessions, and what to expect.",
};

const FAQS: AccordionItem[] = [
  {
    question: "Is this a medical appointment?",
    answer:
      "No. Educational consults and group sessions are education, not diagnosis or treatment. They're designed to help you understand what may be happening and prepare you for conversations with your own clinician.",
  },
  {
    question: "Do I need a referral or diagnosis to book?",
    answer:
      "Not at all. You don't need a specific concern, a partner, or a diagnosis to participate—just curiosity about your own body and health.",
  },
  {
    question: "Is this confidential?",
    answer:
      "Yes. One-on-one consults are private. Group sessions are live but designed so you can participate, listen, and ask questions in a format that feels comfortable to you.",
  },
  {
    question: "Can faith be part of the conversation?",
    answer:
      "If you want it to be. Faith can be woven into the education alongside the biology—it's never required, and the science stands on its own either way.",
  },
  {
    question: "What if I'm not sure which service is right for me?",
    answer:
      "That's completely normal. Reach out and describe what you're navigating, and we'll help point you toward a consult, a group series, or a resource that fits.",
  },
  {
    question: "How is a group session different from a consult?",
    answer:
      "A consult is private and one-on-one, shaped entirely around you. A group session is a live, structured series covering broader topics with room for shared questions and discussion.",
  },
  {
    question: "Do you prescribe medication or hormones?",
    answer:
      "No. This is an education-first space. When appropriate, you'll leave with a clearer sense of what to ask your prescribing clinician and which specialists might be worth involving.",
  },
  {
    question: "How do I book a session?",
    answer:
      "Use the Book a Consult button to see available services, dates, and times. You can also reach out directly by email if you'd rather talk it through first.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions worth answering upfront."
        lead="A few things people usually want to know before their first consult or session."
      />

      <section className="py-16 sm:py-24">
        <Container className="mx-auto max-w-3xl">
          <Reveal>
            <Accordion items={FAQS} />
          </Reveal>
        </Container>
      </section>

      <CtaBand
        eyebrow="Still Have Questions"
        title="Ask before you book."
        body="Send a note with what you're navigating, and we'll help you figure out the right next step."
        primaryCta={{
          label: "Email a Question",
          href: `mailto:${CONTACT_EMAIL}?subject=Question`,
        }}
      />
    </>
  );
}
