import type { Metadata } from "next";
import BookingFlow from "@/components/BookingFlow";
import { BOOKING_SERVICES } from "@/lib/dummy-data";
import { getBookingServices } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Book a Consult",
  description: "Schedule an educational consult, follow-up session, or group series enrollment.",
};

export default async function BookingPage() {
  const cmsServices = await getBookingServices();
  const services = cmsServices.length
    ? cmsServices.map((s) => ({
        id: s.documentId,
        title: s.title,
        duration: s.duration,
        price: s.price,
        description: s.description,
      }))
    : BOOKING_SERVICES;

  return <BookingFlow services={services} />;
}
