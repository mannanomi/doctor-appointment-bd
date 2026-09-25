import Link from "next/link";
import Logo from "@/components/Logo";
import DoctorIllustration from "@/components/DoctorIllustration";

export default function AuthShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-[#f6f8ff] to-[#e9f0ff]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/login">
          <Logo />
        </Link>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-16 px-6 pb-20 pt-8 lg:flex-row">
        <div className="hidden shrink-0 lg:block">
          <DoctorIllustration />
        </div>

        <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-100 sm:p-10">
          <h1 className="mb-7 text-center text-2xl font-bold text-slate-900">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}
