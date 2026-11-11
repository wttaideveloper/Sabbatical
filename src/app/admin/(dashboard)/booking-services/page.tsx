import { assertAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import StatusBanner from "@/components/admin/StatusBanner";
import { loadBookingServices } from "./actions";

export default async function BookingServicesListAdmin({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  await assertAdmin();
  const { status, error } = await searchParams;
  const { data: services, error: loadError } = await loadBookingServices();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-sans text-2xl font-semibold text-burgundy">Booking Services</h2>
        <Link
          href="/admin/booking-services/new"
          className="rounded-full bg-burgundy px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm transition-all hover:bg-burgundy-dark hover:shadow-md"
        >
          + New Service
        </Link>
      </div>

      <StatusBanner status={status as "draft" | "published" | "deleted"} error={error} />
      {loadError && (
        <div className="mb-6 rounded-xl border border-coral/25 bg-coral/5 p-4 text-sm text-ink/80">{loadError}</div>
      )}

      <div className="flex flex-col gap-3">
        {(services ?? []).map((service) => (
          <Link
            key={service.documentId}
            href={`/admin/booking-services/${service.documentId}`}
            className="flex items-center justify-between rounded-xl border border-admin-border bg-white px-5 py-4 shadow-[0_1px_2px_rgba(25,27,34,0.04)] transition-colors hover:border-burgundy/40"
          >
            <div>
              <p className="text-sm font-medium text-ink">{service.title}</p>
              <p className="text-xs text-admin-muted">{service.duration}</p>
            </div>
            <span className="text-sm font-medium text-burgundy">{service.price}</span>
          </Link>
        ))}
        {services?.length === 0 && (
          <p className="text-sm text-admin-muted">No services yet. Add your first one.</p>
        )}
      </div>
    </div>
  );
}
