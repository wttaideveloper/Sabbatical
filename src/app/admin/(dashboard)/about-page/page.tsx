import { TextField, TextAreaField, RichTextField, SectionCard, FieldRow } from "@/components/admin/Fields";
import MediaField from "@/components/admin/MediaField";
import ColorField from "@/components/admin/ColorField";
import FontFamilyField from "@/components/admin/FontFamilyField";
import CustomSectionsField from "@/components/admin/CustomSectionsField";
import ListItemsField from "@/components/admin/ListItemsField";
import SaveButton from "@/components/admin/SaveButton";
import PublishButton from "@/components/admin/PublishButton";
import StickyFormActions from "@/components/admin/StickyFormActions";
import StatusBanner from "@/components/admin/StatusBanner";
import { strapiImageUrl } from "@/lib/strapi";
import { loadAboutPage, saveAboutPage } from "./actions";

export default async function AboutPageAdmin({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  const { status, error } = await searchParams;
  const { data } = await loadAboutPage();
  const draftAction = saveAboutPage.bind(null, "draft");
  const publishAction = saveAboutPage.bind(null, "publish");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-sans text-2xl font-semibold text-burgundy">About Page</h2>
        <StatusBanner status={status as "draft" | "published"} error={error} />
      </div>

      <form action={draftAction} className="flex flex-col gap-6">
        <SectionCard title="Hero">
          <FieldRow>
            <TextField name="heroEyebrow" label="Eyebrow" defaultValue={data?.heroEyebrow} />
            <TextField name="heroTitle" label="Title" defaultValue={data?.heroTitle} required />
          </FieldRow>
          <TextAreaField name="heroLead" label="Lead" defaultValue={data?.heroLead} rows={2} />
          <MediaField
            name="heroPhoto"
            label="Hero Photo"
            currentUrl={strapiImageUrl(data?.heroPhoto)}
          />
          <FieldRow>
            <ColorField name="heroBackgroundColor" label="Hero Background" defaultValue={data?.heroBackgroundColor} />
            <ColorField name="heroTextColor" label="Hero Text Color" defaultValue={data?.heroTextColor} />
          </FieldRow>
          <FontFamilyField name="heroFontFamily" label="Hero Font" defaultValue={data?.heroFontFamily} />
        </SectionCard>

        <SectionCard title="Why Intimate Sabbatical">
          <FieldRow>
            <TextField name="whyEyebrow" label="Eyebrow" defaultValue={data?.whyEyebrow} />
            <TextField name="whyTitle" label="Title" defaultValue={data?.whyTitle} />
          </FieldRow>
          <RichTextField name="whyBody" label="Body" defaultValue={data?.whyBody} />
        </SectionCard>

        <SectionCard title="The Goal">
          <FieldRow>
            <TextField name="goalEyebrow" label="Eyebrow" defaultValue={data?.goalEyebrow} />
            <TextField name="goalTitle" label="Title" defaultValue={data?.goalTitle} />
          </FieldRow>
          <RichTextField name="goalBody" label="Body" defaultValue={data?.goalBody} />
        </SectionCard>

        <SectionCard title="Values">
          <ListItemsField
            name="values"
            label="Value Cards"
            initialItems={data?.values ?? []}
            showNumber
            showTitle
          />
        </SectionCard>

        <SectionCard title="Beyond the Clinic">
          <FieldRow>
            <TextField name="beyondEyebrow" label="Eyebrow" defaultValue={data?.beyondEyebrow} />
            <TextField name="beyondTitle" label="Title" defaultValue={data?.beyondTitle} />
          </FieldRow>
          <RichTextField name="beyondBody" label="Body" defaultValue={data?.beyondBody} />
          <FieldRow>
            <MediaField
              name="hikingPhoto"
              label="Hiking Photo"
              currentUrl={strapiImageUrl(data?.hikingPhoto)}
            />
            <MediaField
              name="dogPhoto"
              label="Dog Photo"
              currentUrl={strapiImageUrl(data?.dogPhoto)}
            />
          </FieldRow>
        </SectionCard>

        <SectionCard title="Closing CTA">
          <FieldRow>
            <TextField name="ctaEyebrow" label="Eyebrow" defaultValue={data?.ctaEyebrow} />
            <TextField name="ctaTitle" label="Title" defaultValue={data?.ctaTitle} />
          </FieldRow>
        </SectionCard>

        <SectionCard title="Custom Sections">
          <CustomSectionsField name="customSections" initialItems={data?.customSections ?? []} />
          <StickyFormActions liveHref="/about" previewPath="/about">
            <SaveButton label="Save Draft" />
            <PublishButton formAction={publishAction} />
          </StickyFormActions>
        </SectionCard>
      </form>
    </div>
  );
}
