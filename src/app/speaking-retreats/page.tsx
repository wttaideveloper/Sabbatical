import type { Metadata } from "next";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import ServiceCard from "@/components/ServiceCard";

export const metadata: Metadata = {
  title: "Speaking & Retreats",
  description:
    "Evidence-informed, engaging sexual-health education for conferences, women's groups, professional audiences, churches, and weekend retreats.",
};

const TOPICS = [
  {
    title: "Hormones & Midlife",
    body: "Perimenopause, menopause, desire, arousal, sleep, mood, pelvic health, and what changes biologically.",
  },
  {
    title: "Pelvic & Sexual Health",
    body: "Bladder health, pelvic floor function, pain, comfort, lubrication, anatomy, and orgasm.",
  },
  {
    title: "Relationships & Intimacy",
    body: "Desire discrepancy, responsive desire, communication, connection, expectations, and context.",
  },
  {
    title: "Faith & Sexuality",
    body: "For faith-based groups that want a thoughtful conversation grounded in biology while making room for belief, meaning, and values.",
  },
];

export default function SpeakingRetreatsPage() {
  return (
    <>
      <PageHero
        eyebrow="Speaking & Retreats"
        title="Bring the conversation into the room."
        lead="Evidence-informed, engaging sexual-health education for conferences, women's groups, professional audiences, churches, organizations, and weekend retreats."
        cta={{ label: "Invite Erika to Speak", href: "#invite" }}
      />

      <section className="border-b border-line py-28">
        <Container className="grid gap-16 lg:grid-cols-2">
          <Reveal>
            <Eyebrow tone="coral">For Groups & Gatherings</Eyebrow>
            <h2 className="max-w-md text-4xl sm:text-5xl">Serious science. Human language.</h2>
          </Reveal>
          <Reveal delay={100} className="max-w-xl text-lg leading-relaxed text-ink/80">
            <p className="mb-6">
              Sexual health can be taught clearly without being clinical in tone, sensational, or
              embarrassing. Talks are designed to give audiences language for what they are
              experiencing and a framework for understanding why it may be happening.
            </p>
            <p>
              Programs can be tailored for a single keynote, a breakout session, a women&rsquo;s
              ministry event, a professional audience, or a full weekend retreat.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line bg-cream-soft py-28">
        <Container>
          <Reveal className="mb-14 max-w-xl">
            <Eyebrow>Topic Areas</Eyebrow>
            <h2 className="text-4xl sm:text-5xl">Talks that connect biology, intimacy, and real life.</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {TOPICS.map((item, i) => (
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
        <Container>
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <Eyebrow tone="coral" className="mx-auto justify-center">
              Formats
            </Eyebrow>
            <h2 className="text-4xl sm:text-5xl">From one hour to a full weekend.</h2>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-3">
            <Reveal delay={0}>
              <ServiceCard
                number="01"
                title="Keynote / Featured Talk"
                body="A focused session built around one clear question or theme, designed for larger audiences."
                note="Best for conferences and large gatherings."
                href="#invite"
                linkLabel="Ask About This Format"
              />
            </Reveal>
            <Reveal delay={100}>
              <ServiceCard
                number="02"
                title="Workshop / Breakout"
                body="More interactive teaching with room for questions, discussion, and practical application."
                note="Best for smaller, focused groups."
                href="#invite"
                linkLabel="Ask About This Format"
              />
            </Reveal>
            <Reveal delay={200}>
              <ServiceCard
                number="03"
                title="Weekend Retreat"
                body="A connected sequence of sessions that lets a group go deeper into body, mind, relationships, faith, and sexual health across the lifespan."
                note="Best for a full immersive experience."
                href="#invite"
                linkLabel="Ask About This Format"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      <CtaBand
        id="invite"
        eyebrow="Start a Conversation"
        title="Planning an event?"
        body="Share the audience, setting, timing, and topics you are considering, and we can shape the right format for your group."
        primaryCta={{
          label: "Invite Erika to Speak",
          href: "mailto:hello@intimatesabbatical.com?subject=Speaking%20Inquiry",
        }}
      />
    </>
  );
}
