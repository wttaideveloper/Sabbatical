import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Videos",
  description: "Short videos on sexual health, hormones, and pelvic health topics.",
};

const VIDEOS = [
  {
    title: "The Biology of Desire, Explained Simply",
    duration: "8:12",
    swatch: "linear-gradient(135deg, #DD6E4A, #8A3F49)",
  },
  {
    title: "Why Lubrication Changes at Midlife",
    duration: "5:47",
    swatch: "linear-gradient(135deg, #D7928D, #DD6E4A)",
  },
  {
    title: "Talking to Your Partner About Desire Discrepancy",
    duration: "11:03",
    swatch: "linear-gradient(135deg, #8A3F49, #5E2A33)",
  },
  {
    title: "What Your Pelvic Floor Is Trying to Tell You",
    duration: "9:26",
    swatch: "linear-gradient(135deg, #5E2A33, #D7928D)",
  },
  {
    title: "Hormones 101: A Midlife Primer",
    duration: "14:38",
    swatch: "linear-gradient(135deg, #DD6E4A, #D7928D)",
  },
  {
    title: "Faith, Biology, and Intimacy Together",
    duration: "10:15",
    swatch: "linear-gradient(135deg, #8A3F49, #DD6E4A)",
  },
];

export default function VideosPage() {
  return (
    <>
      <PageHero
        eyebrow="Videos"
        title="Watch before you read."
        lead="Short, plain-language videos covering the same topics we go deeper on in consults and group sessions."
      />

      <section className="border-b border-line bg-cream-soft py-6">
        <Container>
          <p className="text-center text-xs text-muted">
            Sample video library&mdash;this section will connect to the YouTube channel once
            it&apos;s live.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VIDEOS.map((video, i) => (
              <Reveal key={video.title} delay={(i % 3) * 80}>
                <a
                  href="#"
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white"
                >
                  <div
                    className="relative flex h-44 items-center justify-center"
                    style={{ background: video.swatch }}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 transition-transform duration-300 group-hover:scale-110">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#8A3F49">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="absolute bottom-3 right-3 rounded-md bg-ink/70 px-2 py-1 text-[11px] text-white">
                      {video.duration}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg transition-colors group-hover:text-coral">
                      {video.title}
                    </h3>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
