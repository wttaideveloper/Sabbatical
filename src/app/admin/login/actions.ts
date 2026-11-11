"use server";

import { redirect } from "next/navigation";
import {
  checkLoginAllowed,
  clearLoginFailures,
  endAdminSession,
  getAdminConfigStatus,
  getClientIp,
  passwordMatches,
  recordLoginFailure,
  safeAdminPath,
  startAdminSession,
} from "@/lib/admin-auth";

// NOTE: loginAction and logoutAction intentionally do NOT call assertAdmin() —
// the login action must be reachable while signed out, and logout must always work.

const MAX_PASSWORD_LENGTH = 256;

export async function loginAction(formData: FormData) {
  const from = safeAdminPath(String(formData.get("from") || "/admin"));

  const configStatus = getAdminConfigStatus();
  if (configStatus === "missing") redirect("/admin/login?error=not-configured");
  if (configStatus === "weak") redirect("/admin/login?error=weak-config");

  const ip = await getClientIp();
  if (!checkLoginAllowed(ip).allowed) {
    redirect("/admin/login?error=rate-limited");
  }

  const password = String(formData.get("password") || "");
  const valid = password.length > 0 && password.length <= MAX_PASSWORD_LENGTH && (await passwordMatches(password));

  if (!valid) {
    recordLoginFailure(ip);
    redirect(`/admin/login?error=invalid&from=${encodeURIComponent(from)}`);
  }

  clearLoginFailures(ip);

  const started = await startAdminSession();
  if (!started) redirect("/admin/login?error=not-configured");

  redirect(from);
}

export async function logoutAction() {
  await endAdminSession();
  redirect("/admin/login");
}
