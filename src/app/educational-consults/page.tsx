import type { Metadata } from "next";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import VideoEmbed from "@/components/VideoEmbed";
import CustomSections from "@/components/CustomSections";
import { getEducationalConsultsPage, toParagraphs } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Educational Consults",
  description:
    "A private, clinically guided educational session designed to help you understand what may be changing and what to explore next.",
};

const FALLBACK_EXPLORE = [
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

const FALLBACK_FIT = [
  "Desire or arousal feels different than it used to.",
  "Orgasm has become harder, weaker, delayed, or less predictable.",
  "Sex has become painful, uncomfortable, dry, or anxiety-provoking.",
  "Bladder or pelvic symptoms seem connected to intimacy.",
  "You have received fragmented advice and want help seeing the whole picture.",
  "You want a faith-aware conversation that still stays grounded in science.",
];

export default async function EducationalConsultsPage() {
  const cms = await getEducationalConsultsPage();
  const explore = cms?.exploreItems?.length ? cms.exploreItems : FALLBACK_EXPLORE;
  const fit = cms?.fitItems?.length ? cms.fitItems : FALLBACK_FIT.map((body) => ({ body }));
  const videoUrl = cms?.heroVideoUrl;

  return (
    <>
      <PageHero
        eyebrow={cms?.heroEyebrow || "Clinically Guided Educational Consults"}
        title={cms?.heroTitle || "One conversation. The whole picture."}
        lead={
          cms?.heroLead ||
          "A private educational session designed to help you understand what may be changing, what questions to ask, and what options are worth exploring next."
        }
        cta={{ label: "Book a Consult", href: "/booking" }}
        backgroundColor={cms?.heroBackgroundColor}
        textColor={cms?.heroTextColor}
        fontFamily={cms?.heroFontFamily}
      />

      {videoUrl && (
        <section className="border-b border-line py-20">
          <Container className="mx-auto max-w-3xl">
            <VideoEmbed url={videoUrl} />
          </Container>
        </section>
      )}

      <section className="border-b border-line py-28">
        <Container className="grid gap-16 lg:grid-cols-2">
          <Reveal>
            <Eyebrow tone="coral">{cms?.whatEyebrow || "What This Is"}</Eyebrow>
            <h2 className="max-w-md text-4xl sm:text-5xl">
              {cms?.whatTitle || "Education with clinical context."}
            </h2>
          </Reveal>
          <Reveal delay={100} className="max-w-xl text-lg leading-relaxed text-ink/80">
            {toParagraphs(
              cms?.whatBody ||
                "Sexual health concerns rarely live in one category. A change in desire may intersect with hormones, sleep, stress, medications, pelvic pain, bladder symptoms, relationship dynamics, body image, or life stage.\n\nIn a clinically guided educational consult, body, mind, and relationships are all on the table. The goal is not to diagnose or prescribe. The goal is to help you understand the landscape so you can ask better questions and make more informed decisions."
            ).map((p, i) => (
              <p key={i} className={i > 0 ? "" : "mb-6"}>
                {p}
              </p>
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line bg-cream-soft py-28">
        <Container>
          <Reveal className="mb-14 max-w-xl">
            <Eyebrow>{cms?.exploreEyebrow || "We May Explore"}</Eyebrow>
            <h2 className="text-4xl sm:text-5xl">
              {cms?.exploreTitle || "The pieces that can shape sexual health."}
            </h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {explore.map((item, i) => (
              <Reveal key={i} delay={i * 80}>
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
            <Eyebrow tone="coral">{cms?.fitEyebrow || "This May Be a Good Fit If"}</Eyebrow>
            <h2 className="text-4xl sm:text-5xl">
              {cms?.fitTitle || "You know something changed—but you cannot yet tell why."}
            </h2>
          </Reveal>
          <Reveal delay={100} className="space-y-4">
            {fit.map((item, i) => (
              <p key={i} className="relative pl-7 text-[17px] leading-relaxed text-ink/80">
                <span className="absolute left-0 top-1 text-coral">&#10022;</span>
                {item.body}
              </p>
            ))}
          </Reveal>
        </Container>
      </section>

      <CtaBand
        eyebrow={cms?.ctaEyebrow || "Ready When You Are"}
        title={cms?.ctaTitle || "Start with one conversation."}
        body={
          cms?.ctaBody ||
          "Bring your questions, your timeline, and what you have already tried. We will use the session to make the picture clearer."
        }
        primaryCta={{ label: "Book a Consult", href: "/booking" }}
      />

      <CustomSections blocks={cms?.customSections ?? []} />
    </>
  );
}
