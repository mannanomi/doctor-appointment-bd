"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, Moon, Bell, ChevronDown, LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions";

export default function Topbar({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (city.trim()) params.set("city", city.trim());
    router.push(`/appointments${params.toString() ? `?${params.toString()}` : ""}`);
  }

  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-4">
      <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
        <div className="flex flex-1 items-center gap-2 px-3">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find doctors"
            className="w-full bg-transparent py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="h-6 w-px bg-slate-200" />
        <div className="flex flex-1 items-center gap-2 px-3">
          <MapPin size={16} className="text-slate-400" />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Location (e.g. Dhaka)"
            className="w-full bg-transparent py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-[#0e1a4b] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#16215c]"
        >
          Search
        </button>
      </form>

      <div className="flex items-center gap-3">
        <span
          title="Dark mode (coming soon)"
          className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full text-slate-400"
        >
          <Moon size={18} />
        </span>
        <span
          title="Notifications (coming soon)"
          className="relative flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full text-slate-400"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange-400" />
        </span>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-slate-50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0e1a4b] text-xs font-semibold text-white">
              {initials}
            </span>
            <span className="text-sm font-medium text-slate-700">{userName.split(" ")[0]}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-slate-100 bg-white p-2 shadow-lg">
              <div className="px-3 py-2 text-xs text-slate-400">{userEmail}</div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
