"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { bookAppointmentAction } from "@/lib/actions";
import type { DoctorDTO } from "@/lib/data";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function BookingPanel({ doctor }: { doctor: DoctorDTO }) {
  const availableByDay = useMemo(() => {
    const map = new Map<string, (typeof doctor.availableDates)[number]>();
    for (const ad of doctor.availableDates) {
      map.set(format(new Date(ad.dateISO), "yyyy-MM-dd"), ad);
    }
    return map;
  }, [doctor.availableDates]);

  const firstAvailable = doctor.availableDates.find((ad) =>
    ad.slots.some((s) => !s.booked)
  );

  const [monthCursor, setMonthCursor] = useState(() =>
    firstAvailable ? new Date(firstAvailable.dateISO) : new Date()
  );
  const [selectedDateId, setSelectedDateId] = useState<string | null>(
    firstAvailable?.id ?? null
  );
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(
    firstAvailable?.slots.find((s) => !s.booked)?.id ?? null
  );

  const [state, formAction, pending] = useActionState(bookAppointmentAction, undefined);

  const selectedDate = doctor.availableDates.find((ad) => ad.id === selectedDateId);

  const monthStart = startOfMonth(monthCursor);
  const monthEnd = endOfMonth(monthCursor);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const leadingBlanks = (getDay(monthStart) + 6) % 7; // Monday-first offset

  function selectDay(day: Date) {
    const key = format(day, "yyyy-MM-dd");
    const ad = availableByDay.get(key);
    if (!ad) return;
    setSelectedDateId(ad.id);
    setSelectedSlotId(ad.slots.find((s) => !s.booked)?.id ?? null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Calendar</h3>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
            {format(monthCursor, "MMMM yyyy")}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMonthCursor((m) => subMonths(m, 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => setMonthCursor((m) => addMonths(m, 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-y-1 text-center">
          {WEEKDAYS.map((d) => (
            <span key={d} className="text-[11px] font-medium text-slate-400">
              {d}
            </span>
          ))}

          {Array.from({ length: leadingBlanks }).map((_, i) => (
            <span key={`blank-${i}`} />
          ))}

          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const ad = availableByDay.get(key);
            const hasAvailability = !!ad && ad.slots.some((s) => !s.booked);
            const isSelected = ad && ad.id === selectedDateId;
            const inMonth = isSameMonth(day, monthCursor);

            return (
              <button
                type="button"
                key={key}
                disabled={!hasAvailability}
                onClick={() => selectDay(day)}
                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${
                  !inMonth ? "text-slate-300" : ""
                } ${
                  isSelected
                    ? "bg-[#0e1a4b] font-semibold text-white"
                    : hasAvailability
                      ? "font-medium text-slate-700 hover:bg-slate-100"
                      : "cursor-not-allowed text-slate-300"
                }`}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-slate-900">Visit Hours</h3>

        {selectedDate ? (
          <>
            <p className="mb-3 text-xs text-slate-400">
              {format(new Date(selectedDate.dateISO), "EEEE, d MMMM yyyy")}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {selectedDate.slots.map((slot) => (
                <button
                  type="button"
                  key={slot.id}
                  disabled={slot.booked}
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`rounded-lg px-2 py-2 text-xs font-medium transition ${
                    slot.booked
                      ? "cursor-not-allowed bg-slate-50 text-slate-300 line-through"
                      : slot.id === selectedSlotId
                        ? "bg-[#0e1a4b] text-white"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400">No upcoming availability for this doctor.</p>
        )}

        {state?.error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {state.error}
          </p>
        )}

        <form action={formAction}>
          <input type="hidden" name="doctorId" value={doctor.id} />
          <input type="hidden" name="timeSlotId" value={selectedSlotId ?? ""} />
          <button
            type="submit"
            disabled={!selectedSlotId || pending}
            className="mt-4 w-full rounded-full bg-[#0e1a4b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16215c] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? "Booking..." : "Book an appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}
