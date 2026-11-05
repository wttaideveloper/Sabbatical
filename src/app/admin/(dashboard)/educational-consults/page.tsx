import { TextField, TextAreaField, RichTextField, SectionCard, FieldRow } from "@/components/admin/Fields";
import ListItemsField from "@/components/admin/ListItemsField";
import MediaField from "@/components/admin/MediaField";
import ColorField from "@/components/admin/ColorField";
import FontFamilyField from "@/components/admin/FontFamilyField";
import CustomSectionsField from "@/components/admin/CustomSectionsField";
import SaveButton from "@/components/admin/SaveButton";
import PublishButton from "@/components/admin/PublishButton";
import StickyFormActions from "@/components/admin/StickyFormActions";
import StatusBanner from "@/components/admin/StatusBanner";
import { loadEducationalConsults, saveEducationalConsults } from "./actions";

export default async function EducationalConsultsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  const { status, error } = await searchParams;
  const { data } = await loadEducationalConsults();
  const draftAction = saveEducationalConsults.bind(null, "draft");
  const publishAction = saveEducationalConsults.bind(null, "publish");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-sans text-2xl font-semibold text-burgundy">Educational Consults</h2>
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
            kind="video"
            name="heroVideoUrl"
            label="Hero Video (optional)"
            currentUrl={data?.heroVideoUrl}
            hint="Paste a YouTube/Vimeo link, or upload a video file directly."
          />
          <TextField name="videoCaption" label="Video Caption" defaultValue={data?.videoCaption} />
          <FieldRow>
            <ColorField name="heroBackgroundColor" label="Hero Background" defaultValue={data?.heroBackgroundColor} />
            <ColorField name="heroTextColor" label="Hero Text Color" defaultValue={data?.heroTextColor} />
          </FieldRow>
          <FontFamilyField name="heroFontFamily" label="Hero Font" defaultValue={data?.heroFontFamily} />
        </SectionCard>

        <SectionCard title="What This Is">
          <FieldRow>
            <TextField name="whatEyebrow" label="Eyebrow" defaultValue={data?.whatEyebrow} />
            <TextField name="whatTitle" label="Title" defaultValue={data?.whatTitle} />
          </FieldRow>
          <RichTextField name="whatBody" label="Body" defaultValue={data?.whatBody} />
        </SectionCard>

        <SectionCard title="We May Explore">
          <FieldRow>
            <TextField name="exploreEyebrow" label="Eyebrow" defaultValue={data?.exploreEyebrow} />
            <TextField name="exploreTitle" label="Title" defaultValue={data?.exploreTitle} />
          </FieldRow>
          <ListItemsField
            name="exploreItems"
            label="Items"
            initialItems={data?.exploreItems ?? []}
            showTitle
          />
        </SectionCard>

        <SectionCard title="This May Be a Good Fit If">
          <FieldRow>
            <TextField name="fitEyebrow" label="Eyebrow" defaultValue={data?.fitEyebrow} />
            <TextField name="fitTitle" label="Title" defaultValue={data?.fitTitle} />
          </FieldRow>
          <ListItemsField
            name="fitItems"
            label="Checklist Lines"
            initialItems={data?.fitItems ?? []}
            showTitle={false}
          />
        </SectionCard>

        <SectionCard title="Closing CTA">
          <FieldRow>
            <TextField name="ctaEyebrow" label="Eyebrow" defaultValue={data?.ctaEyebrow} />
            <TextField name="ctaTitle" label="Title" defaultValue={data?.ctaTitle} />
          </FieldRow>
          <TextAreaField name="ctaBody" label="Body" defaultValue={data?.ctaBody} rows={2} />
        </SectionCard>

        <SectionCard title="Custom Sections">
          <CustomSectionsField name="customSections" initialItems={data?.customSections ?? []} />
          <StickyFormActions liveHref="/educational-consults" previewPath="/educational-consults">
            <SaveButton label="Save Draft" />
            <PublishButton formAction={publishAction} />
          </StickyFormActions>
        </SectionCard>
      </form>
    </div>
  );
}
