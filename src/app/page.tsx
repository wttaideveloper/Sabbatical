import Image from "next/image";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import ServiceCard from "@/components/ServiceCard";
import ParallaxImage from "@/components/ParallaxImage";
import { Stagger, StaggerItem } from "@/components/Stagger";
import CustomSections from "@/components/CustomSections";
import { fontFamilyCssVar } from "@/lib/font-options";
import { getHomePage, strapiImageUrl, toParagraphs } from "@/lib/strapi";

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

const FALLBACK = {
  heroEyebrow: "Intimate Sabbatical",
  heroTitle: "Rediscover Intimacy. Reclaim You.",
  heroSubtitle:
    "Science-based education and compassionate support for women navigating perimenopause and beyond.",
  heroImageSrc: "/assets/erika-hero.png",
  heroPrimaryLabel: "Work With Me",
  heroPrimaryHref: "/booking",
  heroSecondaryLabel: "Explore Resources",
  heroSecondaryHref: "#services",
  introEyebrow: "One Place, Whole Picture",
  introTitle: "One place where the whole person is considered.",
  introBody:
    "Intimate Sabbatical was created to close a gap: a place where sexual health is understood in context—not separated into disconnected symptoms.\n\nThe work is grounded in biological science and, when requested, informed by faith. Body, mind, relationships, history, beliefs, and the season of life you are in all belong in the same conversation.",
  modelEyebrow: "The Biopsychosocial Model",
  modelTitle: "Your sexuality lives at the intersection of three worlds.",
  modelNote:
    'Sexuality is not "just in your head." At midlife, biology often begins to drive more of the story—and understanding the biology can change how everything else makes sense.',
  restoreEyebrow: "A Space to Understand",
  restoreTitle: "Understand what changed. Restore what's possible.",
  restoreBody:
    "An integrated biopsychosocial approach looks at the whole picture together. We begin with the body, mind, and relationships rather than making you decide which specialist owns the problem before you even understand it.\n\nFor women who want it, a faith lens can be part of the conversation so education can reflect both biology and belief.",
  aboutTeaserEyebrow: "Meet Erika",
  aboutTeaserTitle: "Nurse Practitioner. Sexual Health Educator. Your Guide.",
  aboutTeaserBody:
    "My clinical career has centered on complex neurologic, pelvic, urologic, and sexual health concerns. Over time, one need became impossible to miss: people often need more room to slow down, learn, connect the dots, and understand what their bodies are telling them.\n\nI created Intimate Sabbatical to make sexual health understandable—to replace guessing with context, connect symptoms that are often treated separately, and help people feel less broken by changes they were never taught to expect.",
  aboutTeaserImageSrc: "/assets/erika-portrait.png",
  ctaEyebrow: "Ready When You Are",
  ctaTitle: "You don't have to keep guessing at this.",
  ctaBody:
    "Wherever you're starting from, there is a way to begin: one conversation, one session, one weekend at a time.",
};

export default async function HomePage() {
  const cms = await getHomePage();

  const heroImageSrc = strapiImageUrl(cms?.heroImage) || FALLBACK.heroImageSrc;
  const aboutTeaserImageSrc = strapiImageUrl(cms?.aboutTeaserImage) || FALLBACK.aboutTeaserImageSrc;

  return (
    <>
      <section
        className="relative overflow-hidden border-b border-line bg-gradient-to-br from-white via-cream to-[#f2e4dd] sm:bg-none"
        style={cms?.heroBackgroundColor ? { background: cms.heroBackgroundColor } : undefined}
      >
        <div className="absolute inset-y-0 right-0 hidden w-[58%] sm:block">
          <ParallaxImage src={heroImageSrc} objectPosition="center 12%" zoom={1.0} />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-cream to-transparent lg:w-40" />
        </div>
        <Container className="relative flex min-h-0 items-center py-20 sm:min-h-[600px] sm:py-28 lg:min-h-[680px]">
          <Stagger className="max-w-md">
            <StaggerItem>
              <h1
                className="font-serif text-5xl font-medium leading-[1.08] text-burgundy sm:text-6xl"
                style={{ color: cms?.heroTextColor || undefined, fontFamily: fontFamilyCssVar(cms?.heroFontFamily) }}
              >
                {cms?.heroTitle || FALLBACK.heroTitle}
              </h1>
            </StaggerItem>
            <StaggerItem>
              <span className="my-6 block h-px w-16 bg-coral" />
            </StaggerItem>
            <StaggerItem>
              <p className="mb-9 text-base leading-relaxed text-muted">
                {cms?.heroSubtitle || FALLBACK.heroSubtitle}
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-wrap gap-3">
                <Button href={cms?.heroPrimaryHref || FALLBACK.heroPrimaryHref}>
                  {cms?.heroPrimaryLabel || FALLBACK.heroPrimaryLabel}
                </Button>
                <Button
                  href={cms?.heroSecondaryHref || FALLBACK.heroSecondaryHref}
                  variant="outline"
                >
                  {cms?.heroSecondaryLabel || FALLBACK.heroSecondaryLabel}
                </Button>
              </div>
            </StaggerItem>
          </Stagger>
        </Container>
      </section>

      <section className="border-b border-line py-28">
        <Container className="grid gap-16 lg:grid-cols-2">
          <Reveal>
            <Eyebrow tone="coral">{cms?.introEyebrow || FALLBACK.introEyebrow}</Eyebrow>
            <h2 className="max-w-md text-4xl sm:text-5xl">
              {cms?.introTitle || FALLBACK.introTitle}
            </h2>
          </Reveal>
          <Reveal delay={100} className="max-w-xl text-lg leading-relaxed text-ink/80">
            {toParagraphs(cms?.introBody || FALLBACK.introBody).map((p, i) => (
              <p key={i} className={i > 0 ? "" : "mb-6"}>
                {p}
              </p>
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line bg-cream-soft py-28">
        <Container>
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <Eyebrow className="mx-auto justify-center">
              {cms?.modelEyebrow || FALLBACK.modelEyebrow}
            </Eyebrow>
            <h2 className="mb-4 text-4xl sm:text-5xl">{cms?.modelTitle || FALLBACK.modelTitle}</h2>
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

          <Reveal
            delay={150}
            className="mx-auto mt-12 max-w-2xl border-l-2 border-coral pl-6 text-lg text-ink/80"
          >
            {cms?.modelNote || FALLBACK.modelNote}
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
            <Eyebrow tone="light">{cms?.restoreEyebrow || FALLBACK.restoreEyebrow}</Eyebrow>
            <h2 className="max-w-lg text-4xl text-white sm:text-5xl">
              {cms?.restoreTitle || FALLBACK.restoreTitle}
            </h2>
          </Reveal>
          <Reveal delay={100} className="max-w-xl text-white/80">
            {toParagraphs(cms?.restoreBody || FALLBACK.restoreBody).map((p, i) => (
              <p key={i} className={`text-lg leading-relaxed ${i > 0 ? "mt-6" : ""}`}>
                {p}
              </p>
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line py-28" id="about">
        <Container className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="relative">
            <div className="absolute -inset-x-5 -bottom-5 -top-5 -z-10 rounded-2xl border border-line" />
            <Image
              src={aboutTeaserImageSrc}
              alt="Erika, nurse practitioner and sexual health educator"
              width={640}
              height={760}
              className="h-[560px] w-full rounded-2xl object-cover object-[center_18%]"
            />
          </Reveal>
          <Reveal delay={100}>
            <Eyebrow tone="coral">{cms?.aboutTeaserEyebrow || FALLBACK.aboutTeaserEyebrow}</Eyebrow>
            <h2 className="mb-6 text-4xl sm:text-5xl">
              {cms?.aboutTeaserTitle || FALLBACK.aboutTeaserTitle}
            </h2>
            {toParagraphs(cms?.aboutTeaserBody || FALLBACK.aboutTeaserBody).map((p, i) => (
              <p key={i} className="mb-5 text-[17px] leading-relaxed text-ink/80 last:mb-8">
                {p}
              </p>
            ))}
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
        eyebrow={cms?.ctaEyebrow || FALLBACK.ctaEyebrow}
        title={cms?.ctaTitle || FALLBACK.ctaTitle}
        body={cms?.ctaBody || FALLBACK.ctaBody}
        primaryCta={{ label: "Book a Consult", href: "/booking" }}
      />

      <CustomSections blocks={cms?.customSections ?? []} />
    </>
  );
}
