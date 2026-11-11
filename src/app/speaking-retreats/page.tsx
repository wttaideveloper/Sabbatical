import type { Metadata } from "next";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import ServiceCard from "@/components/ServiceCard";
import VideoEmbed from "@/components/VideoEmbed";
import CustomSections from "@/components/CustomSections";
import { getSpeakingRetreatsPage, toParagraphs } from "@/lib/strapi";
import { CONTACT_EMAIL } from "@/lib/public-config";

export const metadata: Metadata = {
  title: "Speaking & Retreats",
  description:
    "Evidence-informed, engaging sexual-health education for conferences, women's groups, professional audiences, churches, and weekend retreats.",
};

const FALLBACK_TOPICS = [
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

const FALLBACK_FORMATS = [
  {
    number: "01",
    title: "Keynote / Featured Talk",
    body: "A focused session built around one clear question or theme, designed for larger audiences.",
    note: "Best for conferences and large gatherings.",
  },
  {
    number: "02",
    title: "Workshop / Breakout",
    body: "More interactive teaching with room for questions, discussion, and practical application.",
    note: "Best for smaller, focused groups.",
  },
  {
    number: "03",
    title: "Weekend Retreat",
    body: "A connected sequence of sessions that lets a group go deeper into body, mind, relationships, faith, and sexual health across the lifespan.",
    note: "Best for a full immersive experience.",
  },
];

export default async function SpeakingRetreatsPage() {
  const cms = await getSpeakingRetreatsPage();
  const topics = cms?.topics?.length ? cms.topics : FALLBACK_TOPICS;
  const formats = cms?.formats?.length ? cms.formats : FALLBACK_FORMATS;
  const videoUrl = cms?.heroVideoUrl;

  return (
    <>
      <PageHero
        eyebrow={cms?.heroEyebrow || "Speaking & Retreats"}
        title={cms?.heroTitle || "Bring the conversation into the room."}
        lead={
          cms?.heroLead ||
          "Evidence-informed, engaging sexual-health education for conferences, women's groups, professional audiences, churches, organizations, and weekend retreats."
        }
        cta={{ label: "Invite Erika to Speak", href: "#invite" }}
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
            <Eyebrow tone="coral">{cms?.forGroupsEyebrow || "For Groups & Gatherings"}</Eyebrow>
            <h2 className="max-w-md text-4xl sm:text-5xl">
              {cms?.forGroupsTitle || "Serious science. Human language."}
            </h2>
          </Reveal>
          <Reveal delay={100} className="max-w-xl text-lg leading-relaxed text-ink/80">
            {toParagraphs(
              cms?.forGroupsBody ||
                "Sexual health can be taught clearly without being clinical in tone, sensational, or embarrassing. Talks are designed to give audiences language for what they are experiencing and a framework for understanding why it may be happening.\n\nPrograms can be tailored for a single keynote, a breakout session, a women's ministry event, a professional audience, or a full weekend retreat."
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
            <Eyebrow>{cms?.topicsEyebrow || "Topic Areas"}</Eyebrow>
            <h2 className="text-4xl sm:text-5xl">
              {cms?.topicsTitle || "Talks that connect biology, intimacy, and real life."}
            </h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {topics.map((item, i) => (
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
        <Container>
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <Eyebrow tone="coral" className="mx-auto justify-center">
              {cms?.formatsEyebrow || "Formats"}
            </Eyebrow>
            <h2 className="text-4xl sm:text-5xl">
              {cms?.formatsTitle || "From one hour to a full weekend."}
            </h2>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-3">
            {formats.map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <ServiceCard
                  number={item.number || String(i + 1).padStart(2, "0")}
                  title={item.title || ""}
                  body={item.body}
                  note={item.note || ""}
                  href="#invite"
                  linkLabel="Ask About This Format"
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        id="invite"
        eyebrow={cms?.ctaEyebrow || "Start a Conversation"}
        title={cms?.ctaTitle || "Planning an event?"}
        body={
          cms?.ctaBody ||
          "Share the audience, setting, timing, and topics you are considering, and we can shape the right format for your group."
        }
        primaryCta={{
          label: "Invite Erika to Speak",
          href: `mailto:${CONTACT_EMAIL}?subject=Speaking%20Inquiry`,
        }}
      />

      <CustomSections blocks={cms?.customSections ?? []} />
    </>
  );
}
