import type { Metadata } from "next";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Educational Consults",
  description:
    "A private, clinically guided educational session designed to help you understand what may be changing and what to explore next.",
};

const EXPLORE = [
  {
    title: "Body",
    body: "Hormones, anatomy, pelvic floor, bladder health, pain, circulation, sleep, medications, neurologic factors, and medical history.",
  },
  {
    title: "Mind",
    body: "Stress, mood, attention, self-image, beliefs, expectations, and past experiences.",
  },
  {
    title: "Relationships",
    body: "Communication, connection, desire discrepancy, partnership dynamics, safety, faith, and life circumstances.",
  },
  {
    title: "Next Questions",
    body: "What to bring to your clinician, what type of specialist may be appropriate, and what options or resources may be worth discussing.",
  },
];

const FIT = [
  "Desire or arousal feels different than it used to.",
  "Orgasm has become harder, weaker, delayed, or less predictable.",
  "Sex has become painful, uncomfortable, dry, or anxiety-provoking.",
  "Bladder or pelvic symptoms seem connected to intimacy.",
  "You have received fragmented advice and want help seeing the whole picture.",
  "You want a faith-aware conversation that still stays grounded in science.",
];

export default function EducationalConsultsPage() {
  return (
    <>
      <PageHero
        eyebrow="Clinically Guided Educational Consults"
        title="One conversation. The whole picture."
        lead="A private educational session designed to help you understand what may be changing, what questions to ask, and what options are worth exploring next."
        cta={{ label: "Book a Consult", href: "/booking" }}
      />

      <section className="border-b border-line py-28">
        <Container className="grid gap-16 lg:grid-cols-2">
          <Reveal>
            <Eyebrow tone="coral">What This Is</Eyebrow>
            <h2 className="max-w-md text-4xl sm:text-5xl">Education with clinical context.</h2>
          </Reveal>
          <Reveal delay={100} className="max-w-xl text-lg leading-relaxed text-ink/80">
            <p className="mb-6">
              Sexual health concerns rarely live in one category. A change in desire may intersect
              with hormones, sleep, stress, medications, pelvic pain, bladder symptoms,
              relationship dynamics, body image, or life stage.
            </p>
            <p>
              In a clinically guided educational consult, body, mind, and relationships are all on
              the table. The goal is not to diagnose or prescribe. The goal is to help you
              understand the landscape so you can ask better questions and make more informed
              decisions.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line bg-cream-soft py-28">
        <Container>
          <Reveal className="mb-14 max-w-xl">
            <Eyebrow>We May Explore</Eyebrow>
            <h2 className="text-4xl sm:text-5xl">The pieces that can shape sexual health.</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {EXPLORE.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-line bg-white p-8">
                  <h3 className="mb-3">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-28">
        <Container className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <Eyebrow tone="coral">This May Be a Good Fit If</Eyebrow>
            <h2 className="text-4xl sm:text-5xl">
              You know something changed&mdash;but you cannot yet tell why.
            </h2>
          </Reveal>
          <Reveal delay={100} className="space-y-4">
            {FIT.map((item) => (
              <p key={item} className="relative pl-7 text-[17px] leading-relaxed text-ink/80">
                <span className="absolute left-0 top-1 text-coral">&#10022;</span>
                {item}
              </p>
            ))}
          </Reveal>
        </Container>
      </section>

      <CtaBand
        eyebrow="Ready When You Are"
        title="Start with one conversation."
        body="Bring your questions, your timeline, and what you have already tried. We will use the session to make the picture clearer."
        primaryCta={{ label: "Book a Consult", href: "/booking" }}
      />
    </>
  );
}
