"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  getExpectedSessionToken,
  isAdminPasswordConfigured,
  verifyPassword,
} from "@/lib/admin-auth";

export async function loginAction(formData: FormData) {
  const from = String(formData.get("from") || "/admin");
  const password = String(formData.get("password") || "");

  if (!isAdminPasswordConfigured()) {
    redirect("/admin/login?error=not-configured");
  }

  if (!verifyPassword(password)) {
    redirect(`/admin/login?error=invalid&from=${encodeURIComponent(from)}`);
  }

  const token = await getExpectedSessionToken();
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect(from.startsWith("/admin") ? from : "/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
