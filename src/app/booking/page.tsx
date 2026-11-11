import type { Metadata } from "next";
import BookingFlow from "@/components/BookingFlow";
import PageHero from "@/components/PageHero";
import StatusNotice, { CmsUnavailableNotice } from "@/components/StatusNotice";
import { CONTACT_EMAIL } from "@/lib/public-config";
import { CmsUnavailableError, getBookingServices, type BookingService } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Request a Consult",
  description:
    "Request an educational consult, follow-up session, or group series enrollment. This is a request, not a confirmed appointment.",
};

/** Only real, published CMS services are ever offered. An outage is reported as such. */
async function loadServices(): Promise<{ services: BookingService[]; unavailable: boolean }> {
  try {
    return { services: await getBookingServices(), unavailable: false };
  } catch (err) {
    if (err instanceof CmsUnavailableError) {
      console.error(`[cms] ${err.message}`);
      return { services: [], unavailable: true };
    }
    throw err;
  }
}

export default async function BookingPage() {
  const { services, unavailable } = await loadServices();

  if (unavailable) {
    return (
      <>
        <PageHero
          eyebrow="Request a Consult"
          title="Request your session."
          lead="Tell us what you're looking for and when you'd like to meet."
        />
        <CmsUnavailableNotice />
      </>
    );
  }

  if (services.length === 0) {
    return (
      <>
        <PageHero
          eyebrow="Request a Consult"
          title="Request your session."
          lead="Tell us what you're looking for and when you'd like to meet."
        />
        <StatusNotice eyebrow="Get in touch" title="Online requests aren't open just yet.">
          <p>
            Please email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-burgundy hover:text-coral">
              {CONTACT_EMAIL}
            </a>{" "}
            and we&rsquo;ll help you find the right next step.
          </p>
        </StatusNotice>
      </>
    );
  }

  return (
    <BookingFlow
      services={services.map((s) => ({
        id: s.documentId,
        title: s.title,
        duration: s.duration,
        price: s.price,
        description: s.description,
      }))}
    />
  );
}
