"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Phone } from "lucide-react";
import type { FormState } from "@/lib/actions";

const ICONS = { mail: Mail, lock: Lock, user: User, phone: Phone };

type Field = {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  icon: keyof typeof ICONS;
  required?: boolean;
};

export default function AuthForm({
  action,
  fields,
  submitLabel,
  pendingLabel,
  footerText,
  footerLinkHref,
  footerLinkLabel,
  terms,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  fields: Field[];
  submitLabel: string;
  pendingLabel: string;
  footerText: string;
  footerLinkHref: string;
  footerLinkLabel: string;
  terms?: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {fields.map((field) => {
        const Icon = ICONS[field.icon];
        return (
        <div key={field.name} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-[#3d5cff] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3d5cff]/10">
          <Icon size={17} className="shrink-0 text-slate-400" />
          <input
            key={`${field.name}-${state ? JSON.stringify(state.values) : "initial"}`}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            defaultValue={state?.values?.[field.name] ?? ""}
            aria-label={field.label}
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
        );
      })}

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
      >
        {pending ? pendingLabel : submitLabel}
      </button>

      {terms && <p className="text-center text-xs text-slate-400">{terms}</p>}

      <p className="text-center text-sm text-slate-500">
        {footerText}{" "}
        <Link href={footerLinkHref} className="font-semibold text-[#3d5cff] hover:underline">
          {footerLinkLabel}
        </Link>
      </p>
    </form>
  );
}
