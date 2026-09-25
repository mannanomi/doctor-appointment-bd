import { Stethoscope, Sparkles, CheckCircle2 } from "lucide-react";

const HIGHLIGHTS = [
  "Book verified doctors instantly",
  "Available across 8 divisions in Bangladesh",
  "Chat with your doctor before you visit",
];

export default function DoctorIllustration() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[440px] w-[440px]">
        {/* Background blobs */}
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#dbe4ff] to-[#f3d9ff] opacity-70 blur-sm" />
        <div className="absolute right-2 top-2 h-24 w-24 rounded-full bg-[#c9d6ff]/60 blur-md" />
        <div className="absolute bottom-6 left-2 h-20 w-20 rounded-full bg-[#ffd9ec]/60 blur-md" />

        {/* Doctor figure */}
        <div className="absolute left-10 top-16">
          <div className="relative flex flex-col items-center">
            {/* head */}
            <div className="relative z-10 h-24 w-24 rounded-full bg-gradient-to-b from-[#ffd8b8] to-[#f6c199] shadow-inner">
              <div className="absolute inset-x-3 top-0 h-10 rounded-t-full bg-gradient-to-b from-[#4a3728] to-[#6b4f39]" />
            </div>
            {/* coat / body */}
            <div className="relative -mt-2 h-44 w-60 rounded-t-[3rem] bg-white shadow-[0_10px_30px_rgba(61,92,255,0.15)]">
              <div className="absolute inset-x-0 top-0 mx-auto h-full w-1 bg-slate-100" />
              <div className="absolute left-1/2 top-7 h-7 w-7 -translate-x-1/2 rounded-full bg-[#eef1ff]" />
              {/* stethoscope */}
              <svg
                viewBox="0 0 100 60"
                className="absolute left-1/2 top-4 h-16 w-28 -translate-x-1/2 text-[#3d5cff]"
                fill="none"
              >
                <path
                  d="M20 5 C20 25, 35 30, 50 25 C65 30, 80 25, 80 5"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="30" r="6" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>

        {/* Status mini-card (top-right) */}
        <div className="absolute right-0 top-0 w-44 rounded-2xl bg-white p-3 shadow-lg ring-1 ring-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e7ecff] text-[#3d5cff]">
              <Stethoscope size={14} />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-800">Dr. Rahman</p>
              <p className="flex items-center gap-1 text-[10px] text-emerald-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online
              </p>
            </div>
          </div>
        </div>

        {/* Chat conversation card (right side, below status card) */}
        <div className="absolute right-0 top-24 w-60 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-100">
          <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3d5cff] text-white">
              <Stethoscope size={13} />
            </span>
            <p className="text-xs font-semibold text-slate-800">Chat with your doctor</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="max-w-[80%] rounded-xl rounded-tl-sm bg-slate-100 px-3 py-1.5 text-[11px] text-slate-600">
              Hi! How can I help you today?
            </div>
            <div className="ml-auto max-w-[80%] rounded-xl rounded-tr-sm bg-[#3d5cff] px-3 py-1.5 text-[11px] text-white">
              I&apos;ve had a fever since yesterday.
            </div>
            <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-slate-100 px-3 py-1.5 text-[11px] text-slate-600">
              Let&apos;s get you booked in today.
            </div>
          </div>
        </div>

        {/* Stats card (bottom-left) */}
        <div className="absolute bottom-4 left-0 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-slate-100">
          <div className="flex -space-x-2">
            {["AR", "SI", "TA", "FY"].map((initials, i) => (
              <span
                key={initials}
                style={{ zIndex: 4 - i }}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#e7ecff] text-[9px] font-semibold text-[#3d5cff]"
              >
                {initials}
              </span>
            ))}
          </div>
          <p className="text-sm font-bold text-slate-800">
            500+ <span className="font-medium text-slate-400">doctors</span>
          </p>
        </div>

        {/* Decorative sparkles */}
        <Sparkles className="absolute bottom-24 right-6 text-[#ffb4d8]" size={22} />
        <span className="absolute left-4 top-2 h-2 w-2 rounded-full bg-[#3d5cff]" />
        <span className="absolute right-32 bottom-2 h-1.5 w-1.5 rounded-full bg-[#ff8fc0]" />
      </div>

      {/* Highlights */}
      <div className="mt-4 flex flex-col gap-1.5 self-start">
        {HIGHLIGHTS.map((line) => (
          <p key={line} className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <CheckCircle2 size={14} className="text-[#3d5cff]" />
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
