"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ClipboardList, Stethoscope, MessageCircle, Users, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/appointments", label: "Book Appointment", icon: Stethoscope },
  { href: "/my-appointments", label: "My Appointments", icon: ClipboardList },
];

const DECORATIVE_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "Messages", icon: MessageCircle },
  { label: "Contacts", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-20 flex-col items-center gap-8 bg-[#0e1a4b] py-6">
      <Link
        href="/appointments"
        title="Hello Daktar"
        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-bold text-[#0e1a4b]"
      >
        HD
      </Link>

      <nav className="flex flex-col items-center gap-3">
        {DECORATIVE_ITEMS.slice(0, 1).map((item) => (
          <span
            key={item.label}
            title={`${item.label} (coming soon)`}
            className="flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-xl text-white/40"
          >
            <item.icon size={20} />
          </span>
        ))}

        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                active ? "bg-white text-[#0e1a4b]" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon size={20} />
            </Link>
          );
        })}

        {DECORATIVE_ITEMS.slice(1).map((item) => (
          <span
            key={item.label}
            title={`${item.label} (coming soon)`}
            className="flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-xl text-white/40"
          >
            <item.icon size={20} />
          </span>
        ))}
      </nav>

      <div className="mt-auto">
        <span
          title="Settings (coming soon)"
          className="flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-xl text-white/40"
        >
          <Settings size={20} />
        </span>
      </div>
    </aside>
  );
}
