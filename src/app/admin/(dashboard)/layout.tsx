import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { logoutAction } from "../login/actions";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-admin-bg">
      <header className="sticky top-0 z-20 border-b border-admin-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-10">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="font-serif text-xl text-burgundy">Intimate Sabbatical</span>
            <span className="rounded-full bg-admin-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-admin-muted">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold uppercase tracking-wide text-admin-muted transition-colors hover:text-burgundy"
            >
              View Site &rarr;
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full border border-admin-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink transition-colors hover:border-burgundy hover:text-burgundy"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-6 py-8 sm:px-8 lg:flex-row lg:px-10 lg:py-10">
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <AdminSidebar />
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
