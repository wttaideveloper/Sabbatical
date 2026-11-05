import { TextField, TextAreaField, RichTextField, SectionCard, FieldRow } from "@/components/admin/Fields";
import MediaField from "@/components/admin/MediaField";
import SaveButton from "@/components/admin/SaveButton";
import PublishButton from "@/components/admin/PublishButton";
import StickyFormActions from "@/components/admin/StickyFormActions";
import StatusBanner from "@/components/admin/StatusBanner";
import { strapiImageUrl } from "@/lib/strapi";
import { deleteBlogPost, loadBlogPost, saveBlogPost } from "../actions";

export default async function BlogEditAdmin({
  params,
  searchParams,
}: {
  params: Promise<{ documentId: string }>;
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  const { documentId } = await params;
  const { status, error } = await searchParams;
  const isNew = documentId === "new";
  const { data } = await loadBlogPost(documentId);
  const draftAction = saveBlogPost.bind(null, documentId, "draft");
  const publishAction = saveBlogPost.bind(null, documentId, "publish");
  const deleteAction = deleteBlogPost.bind(null, documentId);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-sans text-2xl font-semibold text-burgundy">{isNew ? "New Blog Post" : "Edit Blog Post"}</h2>
      <StatusBanner status={status as "draft" | "published"} error={error} />

      <form action={draftAction} className="flex flex-col gap-6">
        <SectionCard>
          <FieldRow>
            <TextField name="title" label="Title" defaultValue={data?.title} required />
            <TextField
              name="slug"
              label="Slug"
              defaultValue={data?.slug}
              required
              placeholder="my-post-title"
            />
          </FieldRow>
          <FieldRow>
            <TextField name="category" label="Category" defaultValue={data?.category} />
            <TextField name="readTime" label="Read Time" defaultValue={data?.readTime} placeholder="6 min read" />
          </FieldRow>
          <TextField
            name="publishedDate"
            label="Published Date"
            defaultValue={data?.publishedDate}
            placeholder="March 12, 2026"
          />
          <TextAreaField name="excerpt" label="Excerpt" defaultValue={data?.excerpt} rows={2} />
          <RichTextField name="body" label="Body" defaultValue={data?.body} />
          <MediaField
            name="coverImage"
            label="Cover Image"
            currentUrl={strapiImageUrl(data?.coverImage)}
          />
          <StickyFormActions liveHref={!isNew && data?.slug ? `/blog/${data.slug}` : undefined}>
            <SaveButton label="Save Draft" />
            <PublishButton formAction={publishAction} />
            {!isNew && (
              <button
                type="submit"
                form="delete-blog-post"
                className="text-xs font-semibold uppercase tracking-wide text-admin-muted hover:text-coral"
              >
                Delete this post
              </button>
            )}
          </StickyFormActions>
        </SectionCard>
      </form>

      {!isNew && <form id="delete-blog-post" action={deleteAction} />}
    </div>
  );
}
