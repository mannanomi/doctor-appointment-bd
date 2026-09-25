import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { registerAction } from "@/lib/actions";
import AuthForm from "@/components/AuthForm";
import AuthShell from "@/components/AuthShell";
import SocialButtons from "@/components/SocialButtons";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/appointments");

  return (
    <AuthShell title="Sign Up">
      <SocialButtons />

      <AuthForm
        action={registerAction}
        fields={[
          { name: "name", label: "Full name", type: "text", placeholder: "Full name", icon: "user", required: true },
          { name: "email", label: "Email", type: "email", placeholder: "Email", icon: "mail", required: true },
          { name: "phone", label: "Phone (optional)", type: "tel", placeholder: "Phone (optional)", icon: "phone" },
          { name: "password", label: "Password", type: "password", placeholder: "Password (at least 6 characters)", icon: "lock", required: true },
        ]}
        submitLabel="Sign Up"
        pendingLabel="Creating account..."
        footerText="Already have an account?"
        footerLinkHref="/login"
        footerLinkLabel="Log In"
        terms={
          <>By signing up, you agree to Hello Daktar&apos;s Privacy Policy and Terms of Service.</>
        }
      />
    </AuthShell>
  );
}
