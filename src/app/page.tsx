import Image from "next/image";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import ServiceCard from "@/components/ServiceCard";
import ParallaxImage from "@/components/ParallaxImage";
import { Stagger, StaggerItem } from "@/components/Stagger";

const PILLARS = [
  {
    label: "Body",
    detail: "Hormones, anatomy, medications, medical history",
  },
  {
    label: "Mind",
    detail: "Stress, mood, self-image, past experiences",
  },
  {
    label: "Relationships",
    detail: "Partnership, communication, faith, community",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-br from-white via-cream to-[#f2e4dd] sm:bg-none">
        <div className="absolute inset-y-0 right-0 hidden w-[58%] sm:block">
          <ParallaxImage
            src="/assets/erika-hero.png"
            objectPosition="center 12%"
            zoom={1.0}
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-cream to-transparent lg:w-40" />
        </div>
        <Container className="relative flex min-h-0 items-center py-20 sm:min-h-[600px] sm:py-28 lg:min-h-[680px]">
          <Stagger className="max-w-md">
            <StaggerItem>
              <h1 className="font-serif text-5xl font-medium leading-[1.08] text-burgundy sm:text-6xl">
                Rediscover Intimacy. Reclaim You.
              </h1>
            </StaggerItem>
            <StaggerItem>
              <span className="my-6 block h-px w-16 bg-coral" />
            </StaggerItem>
            <StaggerItem>
              <p className="mb-9 text-base leading-relaxed text-muted">
                Science-based education and compassionate support for women navigating
                perimenopause and beyond.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-wrap gap-3">
                <Button href="/booking">Work With Me</Button>
                <Button href="#services" variant="outline">
                  Explore Resources
                </Button>
              </div>
            </StaggerItem>
          </Stagger>
        </Container>
      </section>

      <section className="border-b border-line py-28">
        <Container className="grid gap-16 lg:grid-cols-2">
          <Reveal>
            <Eyebrow tone="coral">One Place, Whole Picture</Eyebrow>
            <h2 className="max-w-md text-4xl sm:text-5xl">
              One place where the whole person is considered.
            </h2>
          </Reveal>
          <Reveal delay={100} className="max-w-xl text-lg leading-relaxed text-ink/80">
            <p className="mb-6">
              Intimate Sabbatical was created to close a gap: a place where sexual health is
              understood in context&mdash;not separated into disconnected symptoms.
            </p>
            <p>
              The work is grounded in biological science and, when requested, informed by faith.
              Body, mind, relationships, history, beliefs, and the season of life you are in all
              belong in the same conversation.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line bg-cream-soft py-28">
        <Container>
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <Eyebrow className="mx-auto justify-center">The Biopsychosocial Model</Eyebrow>
            <h2 className="mb-4 text-4xl sm:text-5xl">
              Your sexuality lives at the intersection of three worlds.
            </h2>
            <p className="text-lg text-ink/75">When one changes, the others can too.</p>
          </Reveal>

          <Reveal delay={100}>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
              {PILLARS.map((pillar) => (
                <div key={pillar.label} className="bg-white p-10 text-center sm:p-12">
                  <h3 className="mb-3 text-2xl">{pillar.label}</h3>
                  <p className="text-sm leading-relaxed text-muted">{pillar.detail}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150} className="mx-auto mt-12 max-w-2xl border-l-2 border-coral pl-6 text-lg text-ink/80">
            Sexuality is not &ldquo;just in your head.&rdquo; At midlife, biology often begins to
            drive more of the story&mdash;and understanding the biology can change how everything
            else makes sense.
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-burgundy-dark py-28 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 85% 15%, rgba(221,110,74,0.16), transparent 55%)",
          }}
        />
        <Container className="relative grid gap-14 lg:grid-cols-2">
          <Reveal>
            <Eyebrow tone="light">A Space to Understand</Eyebrow>
            <h2 className="max-w-lg text-4xl text-white sm:text-5xl">
              Understand what changed. Restore what&rsquo;s possible.
            </h2>
          </Reveal>
          <Reveal delay={100} className="max-w-xl text-white/80">
            <p className="mb-6 text-lg leading-relaxed">
              An integrated biopsychosocial approach looks at the whole picture together. We begin
              with the body, mind, and relationships rather than making you decide which
              specialist owns the problem before you even understand it.
            </p>
            <p className="text-lg leading-relaxed">
              For women who want it, a faith lens can be part of the conversation so education can
              reflect both biology and belief.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line py-28" id="about">
        <Container className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="relative">
            <div className="absolute -inset-x-5 -bottom-5 -top-5 -z-10 rounded-2xl border border-line" />
            <Image
              src="/assets/erika-portrait.png"
              alt="Erika, nurse practitioner and sexual health educator"
              width={640}
              height={760}
              className="h-[560px] w-full rounded-2xl object-cover object-[center_18%]"
            />
          </Reveal>
          <Reveal delay={100}>
            <Eyebrow tone="coral">Meet Erika</Eyebrow>
            <h2 className="mb-6 text-4xl sm:text-5xl">
              Nurse Practitioner. Sexual Health Educator. Your Guide.
            </h2>
            <p className="mb-5 text-[17px] leading-relaxed text-ink/80">
              My clinical career has centered on complex neurologic, pelvic, urologic, and sexual
              health concerns. Over time, one need became impossible to miss: people often need
              more room to slow down, learn, connect the dots, and understand what their bodies
              are telling them.
            </p>
            <p className="mb-8 text-[17px] leading-relaxed text-ink/80">
              I created Intimate Sabbatical to make sexual health understandable&mdash;to replace
              guessing with context, connect symptoms that are often treated separately, and help
              people feel less broken by changes they were never taught to expect.
            </p>
            <Button href="/about" variant="outline">
              Meet Erika
            </Button>
          </Reveal>
        </Container>
      </section>

      <section className="py-28" id="services">
        <Container>
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <Eyebrow className="mx-auto justify-center">Choose Your Intimate Sabbatical</Eyebrow>
            <h2 className="text-4xl sm:text-5xl">Three ways to begin.</h2>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-3">
            <Reveal delay={0}>
              <ServiceCard
                number="01"
                title="Clinically Guided Educational Consults"
                body="A private one-on-one educational session with body, mind, and relationships all on the table. We explore what may be happening, what questions to ask, and what options exist."
                note="The whole picture—not just one symptom."
                href="/educational-consults"
                linkLabel="Explore Consults"
              />
            </Reveal>
            <Reveal delay={100}>
              <ServiceCard
                number="02"
                title="Live Group Sessions"
                body="A guided series of three or four live sessions with Q&A. Topics may include the biology of sex, lubrication, orgasm, partner dynamics, and why things sometimes go south."
                note="Structured, science-based education with room for real questions."
                href="/group-sessions"
                linkLabel="View Upcoming Series"
              />
            </Reveal>
            <Reveal delay={200}>
              <ServiceCard
                number="03"
                title="Speaking & Retreats"
                body="Conferences and weekend retreats for women's groups, professional audiences, churches, organizations, and other communities."
                note="Hormones, pelvic health, intimacy, faith, relationships, and sexuality across the lifespan."
                href="/speaking-retreats"
                linkLabel="Invite Erika to Speak"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      <CtaBand
        id="consult"
        eyebrow="Ready When You Are"
        title="You don't have to keep guessing at this."
        body="Wherever you're starting from, there is a way to begin: one conversation, one session, one weekend at a time."
        primaryCta={{ label: "Book a Consult", href: "/booking" }}
      />
    </>
  );
}
