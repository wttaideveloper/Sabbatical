import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/dummy-data";

export const metadata: Metadata = {
  title: "Shop",
  description: "Guides, courses, and resources for sexual health and midlife wellness.",
};

export default function ShopPage() {
  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Resources worth keeping."
        lead="Guides, courses, and printables to support the conversations you're already having with yourself."
      />

      <section className="border-b border-line bg-cream-soft py-6">
        <Container>
          <p className="text-center text-xs text-muted">
            Sample shop preview&mdash;full checkout and fulfillment will run through{" "}
            <span className="font-medium text-burgundy">Fullscript</span> once connected.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((product, i) => (
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
