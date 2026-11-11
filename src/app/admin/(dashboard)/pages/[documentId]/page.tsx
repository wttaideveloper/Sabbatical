import { assertAdmin } from "@/lib/admin-auth";
import { TextField, TextAreaField, SectionCard, FieldRow } from "@/components/admin/Fields";
import MediaField from "@/components/admin/MediaField";
import ColorField from "@/components/admin/ColorField";
import FontFamilyField from "@/components/admin/FontFamilyField";
import CustomSectionsField from "@/components/admin/CustomSectionsField";
import SaveButton from "@/components/admin/SaveButton";
import PublishButton from "@/components/admin/PublishButton";
import StickyFormActions from "@/components/admin/StickyFormActions";
import StatusBanner from "@/components/admin/StatusBanner";
import { strapiImageUrl } from "@/lib/strapi";
import { deletePage, loadPage, savePage } from "../actions";

export default async function PageEditAdmin({
  params,
  searchParams,
}: {
  params: Promise<{ documentId: string }>;
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  await assertAdmin();
  const { documentId } = await params;
  const { status, error } = await searchParams;
  const isNew = documentId === "new";
  const { data } = await loadPage(documentId);
  const draftAction = savePage.bind(null, documentId, "draft");
  const publishAction = savePage.bind(null, documentId, "publish");
  const deleteAction = deletePage.bind(null, documentId);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-sans text-2xl font-semibold text-burgundy">{isNew ? "New Page" : "Edit Page"}</h2>
      <StatusBanner status={status as "draft" | "published"} error={error} />

      <form action={draftAction} className="flex flex-col gap-6">
        <SectionCard>
          <TextField name="title" label="Page Title" defaultValue={data?.title} required />
          <div className="flex flex-col gap-1.5">
            <TextField
              name="slug"
              label="URL"
              defaultValue={data?.slug}
              required
              placeholder="my-page-name"
            />
            <p className="text-xs text-admin-muted">
              This page will be published at <strong>yoursite.com/{data?.slug || "my-page-name"}</strong> —
              lowercase letters, numbers, and hyphens only.
            </p>
          </div>
          <TextAreaField
            name="seoDescription"
            label="Search Description (optional)"
            defaultValue={data?.seoDescription}
            rows={2}
            hint="Shown in search results and link previews."
          />
        </SectionCard>

        <SectionCard title="Hero">
          <FieldRow>
            <TextField name="heroEyebrow" label="Eyebrow" defaultValue={data?.heroEyebrow} />
            <TextField name="heroTitle" label="Title" defaultValue={data?.heroTitle} required />
          </FieldRow>
          <TextAreaField name="heroLead" label="Lead" defaultValue={data?.heroLead} rows={2} />
          <MediaField name="heroImage" label="Hero Photo (optional)" currentUrl={strapiImageUrl(data?.heroImage)} />
          <FieldRow>
            <ColorField name="heroBackgroundColor" label="Hero Background" defaultValue={data?.heroBackgroundColor} />
            <ColorField name="heroTextColor" label="Hero Text Color" defaultValue={data?.heroTextColor} />
          </FieldRow>
          <FontFamilyField name="heroFontFamily" label="Hero Font" defaultValue={data?.heroFontFamily} />
        </SectionCard>

        <SectionCard title="Page Builder">
          <p className="text-sm text-admin-muted">
            Add as many sections as you like, in any order — this is the entire body of the page.
          </p>
          <CustomSectionsField name="sections" initialItems={data?.sections ?? []} />
          <StickyFormActions
            liveHref={!isNew && data?.slug ? `/${data.slug}` : undefined}
            previewPath={data?.slug ? `/${data.slug}` : undefined}
          >
            <SaveButton label={isNew ? "Create Page" : "Save Draft"} />
            <PublishButton formAction={publishAction} />
            {!isNew && (
              <button
                type="submit"
                form="delete-page"
                className="text-xs font-semibold uppercase tracking-wide text-admin-muted hover:text-coral"
              >
                Delete this page
              </button>
            )}
          </StickyFormActions>
        </SectionCard>
      </form>

      {!isNew && <form id="delete-page" action={deleteAction} />}
    </div>
  );
}
