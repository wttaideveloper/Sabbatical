import type { Metadata } from "next";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import VideoEmbed from "@/components/VideoEmbed";
import CustomSections from "@/components/CustomSections";
import { getGroupSessionsPage, toParagraphs } from "@/lib/strapi";
import { CONTACT_EMAIL } from "@/lib/public-config";

export const metadata: Metadata = {
  title: "Group Sessions",
  description:
    "Small live series designed to make sexual health understandable, practical, and less awkward to talk about.",
};

const FALLBACK_SESSIONS = [
  {
    number: "01",
    title: "The Biology of Sex",
    body: "Desire, arousal, blood flow, nerves, hormones, attention, context, and what changes across the lifespan.",
  },
  {
    number: "02",
    title: "Comfort, Lubrication & Orgasm",
    body: "Why dryness, pain, pelvic floor changes, and orgasm shifts happen—and how to think about the options.",
  },
  {
    number: "03",
    title: "Partner Dynamics & Desire",
    body: 'Responsive desire, mismatched desire, communication, context, expectations, and why "just try harder" does not work.',
  },
  {
    number: "04",
    title: "Putting It Together",
    body: "An optional fourth session focused on questions, patterns, practical next steps, and integrating body, mind, and relationships.",
  },
];

export default async function GroupSessionsPage() {
  const cms = await getGroupSessionsPage();
  const sessions = cms?.sessions?.length ? cms.sessions : FALLBACK_SESSIONS;
  const videoUrl = cms?.heroVideoUrl;

  return (
    <>
      <PageHero
        eyebrow={cms?.heroEyebrow || "Live Group Sessions"}
        title={cms?.heroTitle || "Learn the science. Ask the questions."}
        lead={
          cms?.heroLead ||
          "Small live series—typically three or four sessions—designed to make sexual health understandable, practical, and less awkward to talk about."
        }
        cta={{ label: "View Upcoming Series", href: "#series" }}
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
            <Eyebrow tone="coral">{cms?.howEyebrow || "How It Works"}</Eyebrow>
            <h2 className="max-w-md text-4xl sm:text-5xl">
              {cms?.howTitle || "Structured teaching with live Q&A."}
            </h2>
          </Reveal>
          <Reveal delay={100} className="max-w-xl text-lg leading-relaxed text-ink/80">
            {toParagraphs(
              cms?.howBody ||
                "Each group series goes deep enough to be useful without turning into a medical-school lecture. We build the biology first, then layer in the psychological, relational, and real-life pieces.\n\nSessions are delivered live, with dedicated time for questions so you can hear the answers to things many women are wondering but rarely have an opportunity to ask."
            ).map((p, i) => (
              <p key={i} className={i > 0 ? "" : "mb-6"}>
                {p}
              </p>
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line bg-cream-soft py-28" id="series">
        <Container>
          <Reveal className="mb-14 max-w-xl">
            <Eyebrow>{cms?.seriesEyebrow || "A Sample Series"}</Eyebrow>
            <h2 className="text-4xl sm:text-5xl">
              {cms?.seriesTitle || "Three or four evenings. One connected story."}
            </h2>
          </Reveal>
          <div className="grid gap-4">
            {sessions.map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <article className="grid grid-cols-[64px_1fr] items-start gap-6 rounded-2xl border border-line bg-white p-8 sm:grid-cols-[86px_1fr]">
                  <span className="font-serif text-4xl text-coral sm:text-5xl">
                    {item.number}
                  </span>
                  <div>
                    <h3 className="mb-2">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{item.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-28">
        <Container className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <Eyebrow tone="coral">{cms?.designedEyebrow || "Designed For"}</Eyebrow>
            <h2 className="text-4xl sm:text-5xl">
              {cms?.designedTitle || "Women who want more than a sound bite."}
            </h2>
          </Reveal>
          <Reveal delay={100} className="max-w-xl text-lg leading-relaxed text-ink/80">
            {toParagraphs(
              cms?.designedBody ||
                "You do not need to have a diagnosis, a partner, or a specific sexual concern to participate. These sessions are for anyone who wants a better working understanding of sexual health, especially during seasons of hormonal and life transition.\n\nGroup education is not individualized medical care. It is a way to learn the framework, hear common questions answered, and become better prepared for your own conversations with clinicians and partners."
            ).map((p, i) => (
              <p key={i} className={i > 0 ? "" : "mb-6"}>
                {p}
              </p>
            ))}
          </Reveal>
        </Container>
      </section>

      <CtaBand
        eyebrow={cms?.ctaEyebrow || "Upcoming Series"}
        title={cms?.ctaTitle || "Join the next live group."}
        body={
          cms?.ctaBody ||
          "Dates and topics can be added here as soon as your next series is scheduled."
        }
        primaryCta={{
          label: "Ask About the Next Series",
          href: `mailto:${CONTACT_EMAIL}?subject=Group%20Sessions`,
        }}
      />

      <CustomSections blocks={cms?.customSections ?? []} />
    </>
  );
}
