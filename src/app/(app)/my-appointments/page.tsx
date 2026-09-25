import Link from "next/link";
import { CalendarCheck, MapPin, CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cancelAppointmentAction } from "@/lib/actions";

export default async function MyAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ booked?: string }>;
}) {
  const { booked } = await searchParams;
  const session = await auth();
  const userId = session!.user.id;

  const appointments = await prisma.appointment.findMany({
    where: { userId },
    include: {
      doctor: { include: { specialty: true, hospital: true } },
      timeSlot: { include: { availableDate: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  const upcoming = appointments.filter(
    (a) => a.status === "confirmed" && a.timeSlot.availableDate.date >= new Date(now.toDateString())
  );
  const past = appointments.filter(
    (a) => a.status === "confirmed" && a.timeSlot.availableDate.date < new Date(now.toDateString())
  );
  const cancelled = appointments.filter((a) => a.status === "cancelled");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">My Appointments</h1>

      {booked && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 size={18} />
          Your appointment has been booked successfully.
        </div>
      )}

      <Section title="Upcoming">
        {upcoming.length === 0 && (
          <EmptyState message="No upcoming appointments." />
        )}
        {upcoming.map((a) => (
          <AppointmentCard key={a.id} appointment={a} cancellable />
        ))}
      </Section>

      {past.length > 0 && (
        <Section title="Past">
          {past.map((a) => (
            <AppointmentCard key={a.id} appointment={a} />
          ))}
        </Section>
      )}

      {cancelled.length > 0 && (
        <Section title="Cancelled">
          {cancelled.map((a) => (
            <AppointmentCard key={a.id} appointment={a} />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="mb-3 text-sm font-semibold text-slate-500">{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-400 shadow-sm">
      {message}{" "}
      <Link href="/appointments" className="font-medium text-[#0e1a4b] hover:underline">
        Book one now
      </Link>
      .
    </div>
  );
}

type AppointmentWithRelations = {
  id: string;
  status: string;
  doctor: {
    name: string;
    specialty: { name: string };
    hospital: { name: string; city: string };
  };
  timeSlot: {
    time: string;
    availableDate: { date: Date };
  };
};

function AppointmentCard({
  appointment,
  cancellable,
}: {
  appointment: AppointmentWithRelations;
  cancellable?: boolean;
}) {
  const date = appointment.timeSlot.availableDate.date;
  const formatted = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);

  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e7eaf5] font-semibold text-[#0e1a4b]">
          {appointment.doctor.name
            .replace(/^Dr\.\s*/i, "")
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">{appointment.doctor.name}</p>
          <p className="text-xs text-slate-400">{appointment.doctor.specialty.name}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
            <MapPin size={12} /> {appointment.doctor.hospital.name}, {appointment.doctor.hospital.city}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
          <CalendarCheck size={15} />
          {formatted} · {appointment.timeSlot.time}
        </div>

        {appointment.status === "cancelled" ? (
          <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500">
            Cancelled
          </span>
        ) : cancellable ? (
          <form action={cancelAppointmentAction}>
            <input type="hidden" name="appointmentId" value={appointment.id} />
            <button
              type="submit"
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 transition hover:border-red-200 hover:text-red-500"
            >
              Cancel
            </button>
          </form>
        ) : (
          <span className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-400">
            Completed
          </span>
        )}
      </div>
    </div>
  );
}
