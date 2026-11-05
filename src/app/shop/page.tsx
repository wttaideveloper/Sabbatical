import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/dummy-data";
import { getProducts, strapiImageUrl } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Shop",
  description: "Supplement recommendations via Fullscript, plus guides and courses for sexual health and midlife wellness.",
};

const SWATCH_PALETTE = [
  "linear-gradient(135deg, #DD6E4A, #8A3F49)",
  "linear-gradient(135deg, #D7928D, #DD6E4A)",
  "linear-gradient(135deg, #8A3F49, #5E2A33)",
  "linear-gradient(135deg, #5E2A33, #D7928D)",
  "linear-gradient(135deg, #DD6E4A, #D7928D)",
  "linear-gradient(135deg, #8A3F49, #DD6E4A)",
];

const FULLSCRIPT_URL = process.env.NEXT_PUBLIC_FULLSCRIPT_URL;

export default async function ShopPage() {
  const cmsProducts = await getProducts();
  const products = cmsProducts.length
    ? cmsProducts.map((p, i) => ({
        id: p.documentId,
        name: p.name,
        category: p.category || "",
        price: p.price,
        blurb: p.blurb || "",
        swatch: SWATCH_PALETTE[i % SWATCH_PALETTE.length],
        imageUrl: strapiImageUrl(p.image),
      }))
    : PRODUCTS;

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Supplements, guides, and courses."
        lead="Professional-grade supplement recommendations through Fullscript, plus guides and courses to keep learning at your own pace."
      />

      <section className="relative overflow-hidden border-b border-line bg-burgundy-dark py-20 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(circle at 15% 20%, rgba(221,110,74,0.18), transparent 55%)",
          }}
        />
        <Container className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <Reveal className="max-w-xl">
            <Eyebrow tone="light">Supplement Dispensary</Eyebrow>
            <h2 className="mb-4 font-serif text-3xl font-medium text-white sm:text-4xl">
              Professional-grade supplements, chosen for you.
            </h2>
            <p className="text-white/75">
              Recommendations are curated specifically for what we&apos;ve discussed in your
              consult, ordered and shipped through Fullscript&mdash;a trusted dispensary used by
              healthcare practitioners.
            </p>
          </Reveal>
          <Reveal delay={100} className="shrink-0">
            {FULLSCRIPT_URL ? (
              <Button href={FULLSCRIPT_URL} variant="cream" className="whitespace-nowrap">
                Shop My Dispensary &rarr;
              </Button>
            ) : (
              <p className="rounded-xl bg-white/10 px-5 py-4 text-sm text-white/70">
                Dispensary link coming soon.
              </p>
            )}
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <Eyebrow tone="coral">Guides &amp; Courses</Eyebrow>
            <h2 className="text-3xl sm:text-4xl">Resources worth keeping.</h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <Reveal key={product.id} delay={(i % 3) * 80}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
