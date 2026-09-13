import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Erika, Nurse Practitioner and Sexual Health Educator, and learn why Intimate Sabbatical exists.",
};

const VALUES = [
  {
    number: "01",
    title: "Clinically Grounded",
    body: "Education rooted in anatomy, physiology, pelvic health, urologic health, nervous system function, medications, hormones, and the medical story.",
  },
  {
    number: "02",
    title: "Whole-Person",
    body: "Body, mind, relationships, history, stress, beliefs, and the season of life are considered together rather than in isolation.",
  },
  {
    number: "03",
    title: "Faith-Informed When Desired",
    body: "For those who want it, faith can be included as part of the conversation without replacing biological science.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Hi, I'm Erika."
        lead="Nurse Practitioner. Sexual Health Educator. Your guide to understanding what changed—and what may still be possible."
        photo="/assets/erika-portrait.png"
      />

      <section className="border-b border-line py-28">
        <Container className="grid gap-16 lg:grid-cols-2">
          <Reveal>
            <Eyebrow tone="coral">Why Intimate Sabbatical</Eyebrow>
            <h2 className="max-w-md text-4xl sm:text-5xl">
              Sexual health deserves more time, context, and clarity.
            </h2>
          </Reveal>
          <Reveal delay={100} className="max-w-xl text-lg leading-relaxed text-ink/80">
            <p className="mb-6">
              My clinical career has centered on complex neurologic, pelvic, urologic, and sexual
              health concerns. I have seen how often people are left trying to make sense of
              symptoms that cross multiple systems&mdash;and how rarely anyone has enough time to
              put the whole story together.
            </p>
            <p>
              I created Intimate Sabbatical to slow the conversation down, connect the dots, teach
              the biology, and make sexual health understandable.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line bg-cream-soft py-28">
        <Container className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Eyebrow className="mx-auto justify-center">The Goal</Eyebrow>
            <h2 className="mb-6 text-4xl sm:text-5xl">
              Less guessing. Less shame. More understanding.
            </h2>
            <p className="text-lg leading-relaxed text-ink/80">
              Changes in desire, arousal, orgasm, comfort, pelvic health, bladder function, and
              intimacy can feel deeply personal. But they are also health information.
              Understanding the biology can make the experience feel far less mysterious&mdash;and
              far less like a personal failure.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-28">
        <Container className="grid gap-6 sm:grid-cols-3">
          {VALUES.map((value, i) => (
            <Reveal key={value.number} delay={i * 100}>
              <article className="h-full border-t-2 border-coral pt-8">
                <span className="mb-3 block font-serif text-4xl text-pink">{value.number}</span>
                <h3 className="mb-3">{value.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{value.body}</p>
              </article>
            </Reveal>
          ))}
        </Container>
      </section>

      <section className="border-t border-line py-28">
        <Container className="grid gap-16 lg:grid-cols-[1fr_1fr]">
          <Reveal className="flex flex-col justify-center">
            <Eyebrow tone="coral">Beyond the Clinic</Eyebrow>
            <h2 className="mb-6 text-4xl sm:text-5xl">Still curious. Still exploring.</h2>
            <p className="text-lg leading-relaxed text-ink/80">
              The same curiosity that shows up in a consult shows up everywhere else, too&mdash;on
              a trail with a view worth the climb, or getting tackled by an enormous, deeply
              unserious Great Dane. Whole-person care starts with living like one.
            </p>
          </Reveal>
          <Reveal delay={100} className="grid grid-cols-2 gap-4">
            <Image
              src="/assets/erika-hiking.jpg"
              alt="Erika hiking with trekking poles, mountains in the background"
              width={640}
              height={640}
              className="h-[320px] w-full rounded-2xl object-cover object-[center_25%] sm:h-[420px]"
            />
            <Image
              src="/assets/erika-dog.jpg"
              alt="Erika laughing with her Great Dane on a trail"
              width={640}
              height={640}
              className="mt-10 h-[320px] w-full rounded-2xl object-cover sm:h-[420px]"
            />
          </Reveal>
        </Container>
      </section>

      <CtaBand
        eyebrow="Where to Begin"
        title="Choose the format that fits you best."
        layout="center"
        primaryCta={{ label: "Educational Consults", href: "/educational-consults" }}
        secondaryCtas={[
          { label: "Group Sessions", href: "/group-sessions" },
          { label: "Speaking & Retreats", href: "/speaking-retreats" },
        ]}
      />
    </>
  );
}
