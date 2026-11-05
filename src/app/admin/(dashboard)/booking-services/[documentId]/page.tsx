import { TextField, TextAreaField, SectionCard, FieldRow } from "@/components/admin/Fields";
import SaveButton from "@/components/admin/SaveButton";
import PublishButton from "@/components/admin/PublishButton";
import StickyFormActions from "@/components/admin/StickyFormActions";
import StatusBanner from "@/components/admin/StatusBanner";
import { deleteBookingService, loadBookingService, saveBookingService } from "../actions";

export default async function BookingServiceEditAdmin({
  params,
  searchParams,
}: {
  params: Promise<{ documentId: string }>;
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  const { documentId } = await params;
  const { status, error } = await searchParams;
  const isNew = documentId === "new";
  const { data } = await loadBookingService(documentId);
  const draftAction = saveBookingService.bind(null, documentId, "draft");
  const publishAction = saveBookingService.bind(null, documentId, "publish");
  const deleteAction = deleteBookingService.bind(null, documentId);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-sans text-2xl font-semibold text-burgundy">
        {isNew ? "New Booking Service" : "Edit Booking Service"}
      </h2>
      <StatusBanner status={status as "draft" | "published"} error={error} />

      <form action={draftAction} className="flex flex-col gap-6">
        <SectionCard>
          <TextField name="title" label="Title" defaultValue={data?.title} required />
          <FieldRow>
            <TextField name="duration" label="Duration" defaultValue={data?.duration} placeholder="60 minutes" />
            <TextField name="price" label="Price" defaultValue={data?.price} placeholder="$185" />
          </FieldRow>
          <TextAreaField name="description" label="Description" defaultValue={data?.description} rows={3} />
          <TextField
            name="order"
            label="Display Order"
            defaultValue={data?.order?.toString()}
            placeholder="0"
          />
          <StickyFormActions liveHref="/booking">
            <SaveButton label="Save Draft" />
            <PublishButton formAction={publishAction} />
            {!isNew && (
              <button
                type="submit"
                form="delete-booking-service"
                className="text-xs font-semibold uppercase tracking-wide text-admin-muted hover:text-coral"
              >
                Delete this service
              </button>
            )}
          </StickyFormActions>
        </SectionCard>
      </form>

      {!isNew && <form id="delete-booking-service" action={deleteAction} />}
    </div>
  );
}
