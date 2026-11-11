import { assertAdmin } from "@/lib/admin-auth";
import { TextField, SectionCard, FieldRow } from "@/components/admin/Fields";
import MediaField from "@/components/admin/MediaField";
import ColorField from "@/components/admin/ColorField";
import FontFamilyField from "@/components/admin/FontFamilyField";
import FontSizeField from "@/components/admin/FontSizeField";
import SaveButton from "@/components/admin/SaveButton";
import PublishButton from "@/components/admin/PublishButton";
import StickyFormActions from "@/components/admin/StickyFormActions";
import StatusBanner from "@/components/admin/StatusBanner";
import { strapiImageUrl } from "@/lib/strapi";
import { loadSiteSettings, saveSiteSettings } from "./actions";

export default async function SiteSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  await assertAdmin();
  const { status, error } = await searchParams;
  const { data } = await loadSiteSettings();
  const draftAction = saveSiteSettings.bind(null, "draft");
  const publishAction = saveSiteSettings.bind(null, "publish");

  return (
    <div>
      <h2 className="mb-6 font-sans text-2xl font-semibold text-burgundy">Site Settings</h2>
      <StatusBanner status={status as "draft" | "published"} error={error} />

      <form action={draftAction} className="flex flex-col gap-6">
        <SectionCard>
          <MediaField name="logo" label="Logo" currentUrl={strapiImageUrl(data?.logo)} />
          <TextField name="footerTagline" label="Footer Tagline" defaultValue={data?.footerTagline} />
          <FieldRow>
            <TextField name="contactEmail" label="Contact Email" defaultValue={data?.contactEmail} />
            <TextField name="instagramUrl" label="Instagram URL" defaultValue={data?.instagramUrl} />
          </FieldRow>
          <TextField name="youtubeUrl" label="YouTube URL" defaultValue={data?.youtubeUrl} />
          <TextField
            name="footerDisclaimer"
            label="Footer Disclaimer"
            defaultValue={data?.footerDisclaimer}
          />
        </SectionCard>

        <SectionCard title="Header & Footer Theme">
          <FieldRow>
            <ColorField
              name="headerBackgroundColor"
              label="Header Background"
              defaultValue={data?.headerBackgroundColor}
            />
            <ColorField name="headerTextColor" label="Header Text Color" defaultValue={data?.headerTextColor} />
          </FieldRow>
          <FieldRow>
            <ColorField
              name="footerBackgroundColor"
              label="Footer Background"
              defaultValue={data?.footerBackgroundColor}
            />
            <ColorField name="footerTextColor" label="Footer Text Color" defaultValue={data?.footerTextColor} />
          </FieldRow>
          <FieldRow>
            <FontFamilyField
              name="headerFooterFontFamily"
              label="Font"
              defaultValue={data?.headerFooterFontFamily}
            />
            <FontSizeField name="headerFooterFontSize" label="Font Size" defaultValue={data?.headerFooterFontSize} />
          </FieldRow>
          <StickyFormActions liveHref="/" previewPath="/">
            <SaveButton label="Save Draft" />
            <PublishButton formAction={publishAction} />
          </StickyFormActions>
        </SectionCard>
      </form>
    </div>
  );
}
