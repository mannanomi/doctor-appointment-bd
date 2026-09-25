import { Stethoscope } from "lucide-react";

export default function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const icon = size === "sm" ? 16 : 18;
  const text = size === "sm" ? "text-base" : "text-lg";

  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex ${box} shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3d5cff] to-[#5b6bff] text-white shadow-sm`}
      >
        <Stethoscope size={icon} />
      </span>
      <span className={`${text} font-bold tracking-tight text-slate-900`}>Hello Daktar</span>
    </div>
  );
}
