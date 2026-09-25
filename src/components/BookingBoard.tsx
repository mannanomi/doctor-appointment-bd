"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, Video } from "lucide-react";
import type { DoctorDTO } from "@/lib/data";
import StarRating from "@/components/StarRating";
import BookingPanel from "@/components/BookingPanel";

function initials(name: string) {
  return name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function DoctorAvatar({ name, size = "h-12 w-12 text-sm" }: { name: string; size?: string }) {
  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-[#e7eaf5] font-semibold text-[#0e1a4b]`}
    >
      {initials(name)}
    </span>
  );
}

export default function BookingBoard({
  doctors,
  specialties,
}: {
  doctors: DoctorDTO[];
  specialties: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").toLowerCase().trim();
  const city = (searchParams.get("city") ?? "").toLowerCase().trim();

  const searchedDoctors = useMemo(() => {
    return doctors.filter((d) => {
      const haystack = `${d.name} ${d.specialty} ${d.hospitalName}`.toLowerCase();
      const qOk = !q || haystack.includes(q);
      const cityOk =
        !city || d.city.toLowerCase().includes(city) || d.division.toLowerCase().includes(city);
      return qOk && cityOk;
    });
  }, [doctors, q, city]);

  const tabs = useMemo(
    () =>
      specialties.map((name) => ({
        name,
        count: searchedDoctors.filter((d) => d.specialty === name).length,
      })),
    [specialties, searchedDoctors]
  );

  const [selectedSpecialty, setSelectedSpecialty] = useState(
    () => tabs.find((t) => t.count > 0)?.name ?? specialties[0]
  );

  useEffect(() => {
    if (!tabs.find((t) => t.name === selectedSpecialty)?.count) {
      const fallback = tabs.find((t) => t.count > 0)?.name ?? specialties[0];
      setSelectedSpecialty(fallback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, city]);

  const doctorsForTab = useMemo(
    () => searchedDoctors.filter((d) => d.specialty === selectedSpecialty),
    [searchedDoctors, selectedSpecialty]
  );

  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(
    doctorsForTab[0]?.id ?? null
  );

  useEffect(() => {
    if (!doctorsForTab.find((d) => d.id === selectedDoctorId)) {
      setSelectedDoctorId(doctorsForTab[0]?.id ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorsForTab]);

  const selectedDoctor = doctorsForTab.find((d) => d.id === selectedDoctorId) ?? null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Book Appointment</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm hover:text-slate-800"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={() => router.forward()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm hover:text-slate-800"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setSelectedSpecialty(tab.name)}
            disabled={tab.count === 0}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedSpecialty === tab.name
                ? "bg-[#0e1a4b] text-white"
                : tab.count === 0
                  ? "cursor-not-allowed text-slate-300"
                  : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {tab.name}
            {q || city ? <span className="ml-1 opacity-70">({tab.count})</span> : null}
          </button>
        ))}
      </div>

      {(q || city) && searchedDoctors.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="font-medium text-slate-700">No doctors matched your search.</p>
          <p className="mt-1 text-sm text-slate-400">
            Try a different name, specialty, or location.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_320px]">
          <div className="flex flex-col gap-3">
            <h2 className="px-1 text-sm font-semibold text-slate-500">Choose Doctor</h2>
            {doctorsForTab.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoctorId(doc.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  selectedDoctorId === doc.id
                    ? "border-[#0e1a4b] bg-white shadow-sm"
                    : "border-transparent bg-white hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <DoctorAvatar name={doc.name} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{doc.name}</p>
                    <p className="text-xs text-slate-400">
                      specialist | {doc.experienceYears} years experience
                    </p>
                  </div>
                </div>
                <span className="mt-3 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                  {doc.specialty}
                </span>
              </button>
            ))}
          </div>

          {selectedDoctor ? (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <DoctorAvatar name={selectedDoctor.name} size="h-16 w-16 text-lg" />
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{selectedDoctor.name}</h2>
                    <p className="text-sm text-slate-400">
                      specialist | {selectedDoctor.experienceYears} years experience
                    </p>
                    <span className="mt-1 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                      {selectedDoctor.specialty}
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-[#0e1a4b]">
                  ৳{selectedDoctor.feeBdt}
                </span>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                    Education
                  </p>
                  <p className="text-sm font-medium text-slate-700">{selectedDoctor.education}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                    Certificate
                  </p>
                  <p className="text-sm font-medium text-slate-700">{selectedDoctor.certificate}</p>
                </div>
              </div>

              <div className="mb-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Available Today
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedDoctor.online && (
                    <span className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                      <Video size={13} /> Online Consultation
                    </span>
                  )}
                  {selectedDoctor.offline && (
                    <span className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                      <MapPin size={13} /> {selectedDoctor.hospitalName}, {selectedDoctor.city}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-500">{selectedDoctor.scheduleText}</p>
              </div>

              <div className="mb-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Symptoms
                </p>
                <p className="text-sm font-medium text-slate-700">
                  {selectedDoctor.symptoms.join(", ")}
                </p>
              </div>

              <div className="mb-6">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Specialty Procedures
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedDoctor.procedures.map((proc) => (
                    <span
                      key={proc}
                      className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      {proc}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">Reviews</h3>
                <div className="flex flex-col divide-y divide-slate-100">
                  {selectedDoctor.reviews.map((review) => (
                    <div key={review.id} className="flex gap-3 py-3">
                      <DoctorAvatar name={review.authorName} size="h-9 w-9 text-xs" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-800">
                            {review.authorName}
                          </p>
                          <StarRating rating={review.rating} />
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                  {selectedDoctor.reviews.length === 0 && (
                    <p className="py-3 text-sm text-slate-400">No reviews yet.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-400 shadow-sm">
              Select a doctor to see details.
            </div>
          )}

          <div>{selectedDoctor && <BookingPanel key={selectedDoctor.id} doctor={selectedDoctor} />}</div>
        </div>
      )}
    </div>
  );
}
