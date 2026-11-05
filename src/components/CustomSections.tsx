import Image from "next/image";
import Container from "./Container";
import Reveal from "./Reveal";
import Button from "./Button";
import VideoEmbed from "./VideoEmbed";
import { fontFamilyCssVar } from "@/lib/font-options";
import { strapiImageUrl, toParagraphs, type CustomSectionBlock } from "@/lib/strapi";

function TextBlock({ block, textStyle }: { block: CustomSectionBlock; textStyle: React.CSSProperties }) {
  const imageSrc = strapiImageUrl(block.image);
  const layout = block.layout ?? "image-right";
  const hasImage = Boolean(imageSrc) && layout !== "text-only";

  return (
    <Reveal
      className={
        hasImage
          ? layout === "image-top"
            ? "flex flex-col gap-10"
            : `grid items-center gap-14 lg:grid-cols-2 ${layout === "image-left" ? "lg:[&>*:first-child]:order-2" : ""}`
          : "mx-auto max-w-2xl text-center"
      }
    >
      {hasImage && imageSrc && (
        <div className={layout === "image-top" ? "w-full" : ""}>
          <Image
            src={imageSrc}
            alt={block.heading || ""}
            width={640}
            height={480}
            className="h-auto w-full rounded-2xl object-cover"
          />
        </div>
      )}
      <div>
        {block.heading && (
          <h2 className="mb-4 text-3xl sm:text-4xl" style={textStyle}>
            {block.heading}
          </h2>
        )}
        {toParagraphs(block.body).map((p, i) => (
          <p key={i} className="mb-4 text-lg leading-relaxed last:mb-0" style={textStyle}>
            {p}
          </p>
        ))}
      </div>
    </Reveal>
  );
}

function CtaBlock({ block, textStyle }: { block: CustomSectionBlock; textStyle: React.CSSProperties }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      {block.heading && (
        <h2 className="mb-4 text-3xl sm:text-4xl" style={textStyle}>
          {block.heading}
        </h2>
      )}
      {toParagraphs(block.body).map((p, i) => (
        <p key={i} className="mb-6 text-lg leading-relaxed last:mb-8" style={textStyle}>
          {p}
        </p>
      ))}
      {block.ctaLabel && block.ctaHref && <Button href={block.ctaHref}>{block.ctaLabel}</Button>}
    </Reveal>
  );
}

function QuoteBlock({ block, textStyle }: { block: CustomSectionBlock; textStyle: React.CSSProperties }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="font-serif text-2xl leading-relaxed sm:text-3xl" style={textStyle}>
        &ldquo;{block.body}&rdquo;
      </p>
      {block.attribution && (
        <p className="mt-6 text-sm uppercase tracking-[0.12em] opacity-70" style={textStyle}>
          {block.attribution}
        </p>
      )}
    </Reveal>
  );
}

function VideoBlock({ block, textStyle }: { block: CustomSectionBlock; textStyle: React.CSSProperties }) {
  if (!block.videoUrl) return null;
  return (
    <Reveal className="mx-auto max-w-3xl">
      {block.heading && (
        <h2 className="mb-6 text-center text-3xl sm:text-4xl" style={textStyle}>
          {block.heading}
        </h2>
      )}
      <VideoEmbed url={block.videoUrl} title={block.heading} />
      {block.body && (
        <p className="mt-4 text-center text-sm opacity-70" style={textStyle}>
          {block.body}
        </p>
      )}
    </Reveal>
  );
}

/** Renders a page's admin-built flexible blocks — appended after a fixed page's
 *  existing sections, or the entire body of a fully admin-created page. */
export default function CustomSections({ blocks }: { blocks: CustomSectionBlock[] }) {
  if (!blocks.length) return null;

  return (
    <>
      {blocks.map((block) => {
        const textStyle = {
          color: block.textColor || undefined,
          fontFamily: fontFamilyCssVar(block.fontFamily),
        };

        return (
          <section
            key={block.id}
            className="border-b border-line py-20"
            style={{ backgroundColor: block.backgroundColor || undefined }}
          >
            <Container>
              {block.blockType === "cta" && <CtaBlock block={block} textStyle={textStyle} />}
              {block.blockType === "quote" && <QuoteBlock block={block} textStyle={textStyle} />}
              {block.blockType === "video" && <VideoBlock block={block} textStyle={textStyle} />}
              {(!block.blockType || block.blockType === "text") && (
                <TextBlock block={block} textStyle={textStyle} />
              )}
            </Container>
          </section>
        );
      })}
    </>
  );
}
