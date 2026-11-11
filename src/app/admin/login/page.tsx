import { getAdminConfigStatus } from "@/lib/admin-auth";
import PasswordField from "@/components/admin/PasswordField";
import { loginAction } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const { error, from } = await searchParams;
  const configStatus = getAdminConfigStatus();

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-bg px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-admin-border bg-white p-8 shadow-[0_1px_2px_rgba(25,27,34,0.04)]">
        <h1 className="mb-1 font-serif text-2xl text-burgundy">Admin</h1>
        <p className="mb-6 text-sm text-admin-muted">Sign in to manage site content.</p>

        {configStatus === "missing" ? (
          <p className="rounded-xl border border-coral/25 bg-coral/5 p-4 text-sm text-ink/80">
            ADMIN_PANEL_PASSWORD and ADMIN_SESSION_SECRET aren&apos;t set. Add them to the
            environment (.env.local in development, the server&apos;s .env file in production) and
            restart the app.
          </p>
        ) : configStatus === "weak" ? (
          <p className="rounded-xl border border-coral/25 bg-coral/5 p-4 text-sm text-ink/80">
            Admin sign-in is disabled because ADMIN_PANEL_PASSWORD (at least 12 characters) or
            ADMIN_SESSION_SECRET (at least 32 characters) is too short for production.
          </p>
        ) : (
          <form action={loginAction} className="flex flex-col gap-4">
            <input type="hidden" name="from" value={from || "/admin"} />
            <PasswordField name="password" placeholder="Password" autoFocus required />
            {error === "invalid" && (
              <p className="text-xs text-coral">Incorrect password. Try again.</p>
            )}
            {error === "rate-limited" && (
              <p className="text-xs text-coral">
                Too many failed attempts. Please wait about 15 minutes and try again.
              </p>
            )}
            {error === "not-configured" && (
              <p className="text-xs text-coral">Admin sign-in is not configured.</p>
            )}
            <button
              type="submit"
              className="rounded-full bg-burgundy px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-sm transition-all hover:bg-burgundy-dark hover:shadow-md"
            >
              Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
