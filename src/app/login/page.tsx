import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { loginAction } from "@/lib/actions";
import AuthForm from "@/components/AuthForm";
import AuthShell from "@/components/AuthShell";
import SocialButtons from "@/components/SocialButtons";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/appointments");

  return (
    <AuthShell title="Log In">
      <SocialButtons />

      <AuthForm
        action={loginAction}
        fields={[
          { name: "email", label: "Email", type: "email", placeholder: "Email", icon: "mail", required: true },
          { name: "password", label: "Password", type: "password", placeholder: "Password", icon: "lock", required: true },
        ]}
        submitLabel="Log In"
        pendingLabel="Logging in..."
        footerText="Don't have an account?"
        footerLinkHref="/register"
        footerLinkLabel="Sign Up"
      />

      <p className="mt-6 rounded-xl bg-[#3d5cff]/5 p-3 text-center text-xs text-slate-500">
        Demo account: <span className="font-medium text-slate-700">demo@carebd.com</span> / password123
      </p>
    </AuthShell>
  );
}
