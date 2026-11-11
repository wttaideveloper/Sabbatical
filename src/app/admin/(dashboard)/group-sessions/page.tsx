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
import { loadGroupSessions, saveGroupSessions } from "./actions";

export default async function GroupSessionsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  await assertAdmin();
  const { status, error } = await searchParams;
  const { data } = await loadGroupSessions();
  const draftAction = saveGroupSessions.bind(null, "draft");
  const publishAction = saveGroupSessions.bind(null, "publish");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-sans text-2xl font-semibold text-burgundy">Group Sessions</h2>
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

        <SectionCard title="How It Works">
          <FieldRow>
            <TextField name="howEyebrow" label="Eyebrow" defaultValue={data?.howEyebrow} />
            <TextField name="howTitle" label="Title" defaultValue={data?.howTitle} />
          </FieldRow>
          <RichTextField name="howBody" label="Body" defaultValue={data?.howBody} />
        </SectionCard>

        <SectionCard title="A Sample Series">
          <FieldRow>
            <TextField name="seriesEyebrow" label="Eyebrow" defaultValue={data?.seriesEyebrow} />
            <TextField name="seriesTitle" label="Title" defaultValue={data?.seriesTitle} />
          </FieldRow>
          <ListItemsField
            name="sessions"
            label="Sessions"
            initialItems={data?.sessions ?? []}
            showNumber
            showTitle
          />
        </SectionCard>

        <SectionCard title="Designed For">
          <FieldRow>
            <TextField name="designedEyebrow" label="Eyebrow" defaultValue={data?.designedEyebrow} />
            <TextField name="designedTitle" label="Title" defaultValue={data?.designedTitle} />
          </FieldRow>
          <RichTextField name="designedBody" label="Body" defaultValue={data?.designedBody} />
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
          <StickyFormActions liveHref="/group-sessions" previewPath="/group-sessions">
            <SaveButton label="Save Draft" />
            <PublishButton formAction={publishAction} />
          </StickyFormActions>
        </SectionCard>
      </form>
    </div>
  );
}
