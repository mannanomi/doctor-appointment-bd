import { prisma } from "@/lib/prisma";

export type SlotDTO = { id: string; time: string; booked: boolean };
export type AvailableDateDTO = { id: string; dateISO: string; slots: SlotDTO[] };
export type ReviewDTO = { id: string; authorName: string; rating: number; comment: string };

export type DoctorDTO = {
  id: string;
  name: string;
  specialty: string;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  division: string;
  experienceYears: number;
  education: string;
  certificate: string;
  symptoms: string[];
  procedures: string[];
  feeBdt: number;
  scheduleText: string;
  online: boolean;
  offline: boolean;
  availableDates: AvailableDateDTO[];
  reviews: ReviewDTO[];
};

export async function getDoctors(): Promise<DoctorDTO[]> {
  const doctors = await prisma.doctor.findMany({
    include: {
      specialty: true,
      hospital: { include: { division: true } },
      reviews: { orderBy: { createdAt: "desc" } },
      availableDates: {
        orderBy: { date: "asc" },
        include: {
          slots: {
            orderBy: { time: "asc" },
            include: { appointments: { where: { status: "confirmed" } } },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return doctors.map((d) => ({
    id: d.id,
    name: d.name,
    specialty: d.specialty.name,
    hospitalName: d.hospital.name,
    hospitalAddress: d.hospital.address,
    city: d.hospital.city,
    division: d.hospital.division.name,
    experienceYears: d.experienceYears,
    education: d.education,
    certificate: d.certificate,
    symptoms: d.symptoms.split(",").map((s) => s.trim()).filter(Boolean),
    procedures: d.procedures.split(",").map((s) => s.trim()).filter(Boolean),
    feeBdt: d.feeBdt,
    scheduleText: d.scheduleText,
    online: d.online,
    offline: d.offline,
    availableDates: d.availableDates.map((ad) => ({
      id: ad.id,
      dateISO: ad.date.toISOString(),
      slots: ad.slots.map((s) => ({
        id: s.id,
        time: s.time,
        booked: s.appointments.length > 0,
      })),
    })),
    reviews: d.reviews.map((r) => ({
      id: r.id,
      authorName: r.authorName,
      rating: r.rating,
      comment: r.comment,
    })),
  }));
}

export const SPECIALTIES = [
  "Cardiology",
  "Psychology",
  "Traumatology",
  "Pediatrics",
  "Anesthiology",
  "Opthalmology",
  "Dentistry",
  "General Diagnosis",
  "Neuro Surgent",
];
