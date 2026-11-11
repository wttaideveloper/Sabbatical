import { assertAdmin } from "@/lib/admin-auth";
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
import { loadSpeakingRetreats, saveSpeakingRetreats } from "./actions";

export default async function SpeakingRetreatsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  await assertAdmin();
  const { status, error } = await searchParams;
  const { data } = await loadSpeakingRetreats();
  const draftAction = saveSpeakingRetreats.bind(null, "draft");
  const publishAction = saveSpeakingRetreats.bind(null, "publish");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-sans text-2xl font-semibold text-burgundy">Speaking &amp; Retreats</h2>
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

        <SectionCard title="For Groups & Gatherings">
          <FieldRow>
            <TextField name="forGroupsEyebrow" label="Eyebrow" defaultValue={data?.forGroupsEyebrow} />
            <TextField name="forGroupsTitle" label="Title" defaultValue={data?.forGroupsTitle} />
          </FieldRow>
          <RichTextField name="forGroupsBody" label="Body" defaultValue={data?.forGroupsBody} />
        </SectionCard>

        <SectionCard title="Topic Areas">
          <FieldRow>
            <TextField name="topicsEyebrow" label="Eyebrow" defaultValue={data?.topicsEyebrow} />
            <TextField name="topicsTitle" label="Title" defaultValue={data?.topicsTitle} />
          </FieldRow>
          <ListItemsField
            name="topics"
            label="Topics"
            initialItems={data?.topics ?? []}
            showTitle
          />
        </SectionCard>

        <SectionCard title="Formats">
          <FieldRow>
            <TextField name="formatsEyebrow" label="Eyebrow" defaultValue={data?.formatsEyebrow} />
            <TextField name="formatsTitle" label="Title" defaultValue={data?.formatsTitle} />
          </FieldRow>
          <ListItemsField
            name="formats"
            label="Formats"
            initialItems={data?.formats ?? []}
            showNumber
            showTitle
            showNote
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
          <StickyFormActions liveHref="/speaking-retreats" previewPath="/speaking-retreats">
            <SaveButton label="Save Draft" />
            <PublishButton formAction={publishAction} />
          </StickyFormActions>
        </SectionCard>
      </form>
    </div>
  );
}
