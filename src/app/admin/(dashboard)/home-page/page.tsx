import { assertAdmin } from "@/lib/admin-auth";
import { TextField, RichTextField, SectionCard, FieldRow } from "@/components/admin/Fields";
import MediaField from "@/components/admin/MediaField";
import ColorField from "@/components/admin/ColorField";
import FontFamilyField from "@/components/admin/FontFamilyField";
import CustomSectionsField from "@/components/admin/CustomSectionsField";
import SaveButton from "@/components/admin/SaveButton";
import PublishButton from "@/components/admin/PublishButton";
import StickyFormActions from "@/components/admin/StickyFormActions";
import StatusBanner from "@/components/admin/StatusBanner";
import { strapiImageUrl } from "@/lib/strapi";
import { loadHomePage, saveHomePage } from "./actions";

export default async function HomePageAdmin({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  await assertAdmin();
  const { status, error } = await searchParams;
  const { data } = await loadHomePage();
  const draftAction = saveHomePage.bind(null, "draft");
  const publishAction = saveHomePage.bind(null, "publish");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-sans text-2xl font-semibold text-burgundy">Home Page</h2>
        <StatusBanner status={status as "draft" | "published"} error={error} />
      </div>

      <form action={draftAction} className="flex flex-col gap-6">
        <SectionCard title="Hero">
          <FieldRow>
            <TextField name="heroEyebrow" label="Eyebrow" defaultValue={data?.heroEyebrow} />
            <TextField name="heroTitle" label="Title" defaultValue={data?.heroTitle} required />
          </FieldRow>
          <TextField name="heroSubtitle" label="Subtitle" defaultValue={data?.heroSubtitle} />
          <MediaField
            name="heroImage"
            label="Hero Image"
            currentUrl={strapiImageUrl(data?.heroImage)}
          />
          <FieldRow>
            <TextField
              name="heroPrimaryLabel"
              label="Primary Button Label"
              defaultValue={data?.heroPrimaryLabel}
            />
            <TextField
              name="heroPrimaryHref"
              label="Primary Button Link"
              defaultValue={data?.heroPrimaryHref}
            />
          </FieldRow>
          <FieldRow>
            <TextField
              name="heroSecondaryLabel"
              label="Secondary Button Label"
              defaultValue={data?.heroSecondaryLabel}
            />
            <TextField
              name="heroSecondaryHref"
              label="Secondary Button Link"
              defaultValue={data?.heroSecondaryHref}
            />
          </FieldRow>
          <FieldRow>
            <ColorField name="heroBackgroundColor" label="Hero Background" defaultValue={data?.heroBackgroundColor} />
            <ColorField name="heroTextColor" label="Hero Text Color" defaultValue={data?.heroTextColor} />
          </FieldRow>
          <FontFamilyField name="heroFontFamily" label="Hero Font" defaultValue={data?.heroFontFamily} />
        </SectionCard>

        <SectionCard title="One Place, Whole Picture">
          <FieldRow>
            <TextField name="introEyebrow" label="Eyebrow" defaultValue={data?.introEyebrow} />
            <TextField name="introTitle" label="Title" defaultValue={data?.introTitle} />
          </FieldRow>
          <RichTextField name="introBody" label="Body" defaultValue={data?.introBody} />
        </SectionCard>

        <SectionCard title="Biopsychosocial Model">
          <FieldRow>
            <TextField name="modelEyebrow" label="Eyebrow" defaultValue={data?.modelEyebrow} />
            <TextField name="modelTitle" label="Title" defaultValue={data?.modelTitle} />
          </FieldRow>
          <RichTextField name="modelNote" label="Callout Note" defaultValue={data?.modelNote} />
        </SectionCard>

        <SectionCard title="Restore (Dark Band)">
          <FieldRow>
            <TextField name="restoreEyebrow" label="Eyebrow" defaultValue={data?.restoreEyebrow} />
            <TextField name="restoreTitle" label="Title" defaultValue={data?.restoreTitle} />
          </FieldRow>
          <RichTextField name="restoreBody" label="Body" defaultValue={data?.restoreBody} />
        </SectionCard>

        <SectionCard title="Meet Erika Teaser">
          <FieldRow>
            <TextField
              name="aboutTeaserEyebrow"
              label="Eyebrow"
              defaultValue={data?.aboutTeaserEyebrow}
            />
            <TextField
              name="aboutTeaserTitle"
              label="Title"
              defaultValue={data?.aboutTeaserTitle}
            />
          </FieldRow>
          <RichTextField
            name="aboutTeaserBody"
            label="Body"
            defaultValue={data?.aboutTeaserBody}
          />
          <MediaField
            name="aboutTeaserImage"
            label="Photo"
            currentUrl={strapiImageUrl(data?.aboutTeaserImage)}
          />
        </SectionCard>

        <SectionCard title="Closing CTA">
          <FieldRow>
            <TextField name="ctaEyebrow" label="Eyebrow" defaultValue={data?.ctaEyebrow} />
            <TextField name="ctaTitle" label="Title" defaultValue={data?.ctaTitle} />
          </FieldRow>
          <RichTextField name="ctaBody" label="Body" defaultValue={data?.ctaBody} />
        </SectionCard>

        <SectionCard title="Custom Sections">
          <CustomSectionsField name="customSections" initialItems={data?.customSections ?? []} />
          <StickyFormActions liveHref="/" previewPath="/">
            <SaveButton label="Save Draft" />
            <PublishButton formAction={publishAction} />
          </StickyFormActions>
        </SectionCard>
      </form>
    </div>
  );
}
