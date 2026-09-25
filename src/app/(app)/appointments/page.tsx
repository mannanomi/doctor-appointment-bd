import { Suspense } from "react";
import { getDoctors, SPECIALTIES } from "@/lib/data";
import BookingBoard from "@/components/BookingBoard";

export default async function AppointmentsPage() {
  const doctors = await getDoctors();

  return (
    <Suspense fallback={null}>
      <BookingBoard doctors={doctors} specialties={SPECIALTIES} />
    </Suspense>
  );
}
