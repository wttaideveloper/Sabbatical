import { assertAdmin } from "@/lib/admin-auth";
import { TextField, TextAreaField, SectionCard, FieldRow } from "@/components/admin/Fields";
import MediaField from "@/components/admin/MediaField";
import SaveButton from "@/components/admin/SaveButton";
import PublishButton from "@/components/admin/PublishButton";
import StickyFormActions from "@/components/admin/StickyFormActions";
import StatusBanner from "@/components/admin/StatusBanner";
import { strapiImageUrl } from "@/lib/strapi";
import { deleteProduct, loadProduct, saveProduct } from "../actions";

export default async function ProductEditAdmin({
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
  const { data } = await loadProduct(documentId);
  const draftAction = saveProduct.bind(null, documentId, "draft");
  const publishAction = saveProduct.bind(null, documentId, "publish");
  const deleteAction = deleteProduct.bind(null, documentId);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-sans text-2xl font-semibold text-burgundy">{isNew ? "New Product" : "Edit Product"}</h2>
      <StatusBanner status={status as "draft" | "published"} error={error} />

      <form action={draftAction} className="flex flex-col gap-6">
        <SectionCard>
          <TextField name="name" label="Name" defaultValue={data?.name} required />
          <FieldRow>
            <TextField name="category" label="Category" defaultValue={data?.category} />
            <TextField
              name="price"
              label="Price (USD)"
              defaultValue={data?.price?.toString()}
              placeholder="28"
              required
            />
          </FieldRow>
          <TextAreaField name="blurb" label="Blurb" defaultValue={data?.blurb} rows={3} />
          <MediaField name="image" label="Product Image" currentUrl={strapiImageUrl(data?.image)} />
          <TextField
            name="order"
            label="Display Order"
            defaultValue={data?.order?.toString()}
            placeholder="0"
          />
          <StickyFormActions liveHref="/shop">
            <SaveButton label="Save Draft" />
            <PublishButton formAction={publishAction} />
            {!isNew && (
              <button
                type="submit"
                form="delete-product"
                className="text-xs font-semibold uppercase tracking-wide text-admin-muted hover:text-coral"
              >
                Delete this product
              </button>
            )}
          </StickyFormActions>
        </SectionCard>
      </form>

      {!isNew && <form id="delete-product" action={deleteAction} />}
    </div>
  );
}
