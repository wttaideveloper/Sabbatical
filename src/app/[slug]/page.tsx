import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import PageHero from "@/components/PageHero";
import CustomSections from "@/components/CustomSections";
import { getDynamicPageBySlug, strapiImageUrl } from "@/lib/strapi";
import { getDynamicPageBySlugPreview } from "@/lib/strapi-preview";
import { isLookupableSlug } from "@/lib/slugs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // Scanner/bot paths such as /wp-login.php or /.env never trigger a CMS request.
  if (!isLookupableSlug(slug)) return {};

  try {
    const page = await getDynamicPageBySlug(slug);
    if (!page) return {};
    return {
      title: page.title,
      description: page.seoDescription || page.heroLead,
    };
  } catch {
    // CMS outage: the page render below surfaces the failure; metadata just stays generic.
    return {};
  }
}

export default async function DynamicPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isLookupableSlug(slug)) notFound();

  const { isEnabled } = await draftMode();
  const page = isEnabled ? await getDynamicPageBySlugPreview(slug) : await getDynamicPageBySlug(slug);

  if (!page) notFound();

  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow || ""}
        title={page.heroTitle}
        lead={page.heroLead || ""}
        photo={strapiImageUrl(page.heroImage)}
        backgroundColor={page.heroBackgroundColor}
        textColor={page.heroTextColor}
        fontFamily={page.heroFontFamily}
      />
      <CustomSections blocks={page.sections ?? []} />
    </>
  );
}
