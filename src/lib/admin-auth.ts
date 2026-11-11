import "server-only";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  createSessionToken,
  getAdminConfigStatus,
  revokeSession,
  verifySessionToken,
  type AdminSession,
} from "./admin-session";

export { getAdminConfigStatus, passwordMatches, safeAdminPath } from "./admin-session";

const isProduction = process.env.NODE_ENV === "production";

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: isProduction,
    // The admin is a self-contained app (preview iframe is same-site), so Strict is
    // safe and removes cross-site request cookies entirely.
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}

// ---------- session helpers ----------

/** Returns the verified session, or null. Never throws. */
export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_SESSION_COOKIE)?.value);
}

/**
 * Independent server-side authorization check.
 *
 * Every admin Server Action, admin data loader, admin page and admin route handler
 * calls this first. `src/proxy.ts` is only a convenience redirect: Server Actions are
 * public POST endpoints and must never rely on it as the sole gate.
 *
 * Do NOT call this from the login action — it has to stay reachable while signed out.
 */
export async function assertAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Creates a fresh session and sets the cookie. Returns false if auth isn't configured. */
export async function startAdminSession(): Promise<boolean> {
  const created = await createSessionToken();
  if (!created) return false;
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, created.token, cookieOptions(ADMIN_SESSION_TTL_SECONDS));
  return true;
}

/** Revokes the current session (until its natural expiry) and clears the cookie. */
export async function endAdminSession(): Promise<void> {
  const store = await cookies();
  const session = await verifySessionToken(store.get(ADMIN_SESSION_COOKIE)?.value);
  if (session) revokeSession(session);
  store.set(ADMIN_SESSION_COOKIE, "", cookieOptions(0));
}

// ---------- client IP ----------

const IP_PATTERN = /^[0-9a-fA-F:.]{3,45}$/;

/**
 * Nginx is expected to OVERWRITE (not append to) the client-IP headers:
 *   proxy_set_header X-Real-IP       $remote_addr;
 *   proxy_set_header X-Forwarded-For $remote_addr;
 * See deploy/nginx/web.conf.template. The web container is only reachable through
 * that proxy (it is bound to 127.0.0.1), so these headers can be trusted. Values that
 * don't look like an IP are discarded so they can't be used to bloat the limiter.
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const candidates = [
    h.get("x-real-ip"),
    // Rightmost entry = the one added by our own proxy, never client-supplied.
    h.get("x-forwarded-for")?.split(",").pop(),
  ];
  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (value && IP_PATTERN.test(value)) return value;
  }
  return "unknown";
}

// ---------- login rate limiting (in-memory, per IP) ----------

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const MAX_TRACKED_IPS = 5000;

type Attempt = { count: number; windowStart: number };

const attemptStore = globalThis as typeof globalThis & {
  __isAdminLoginAttempts?: Map<string, Attempt>;
};

function attempts(): Map<string, Attempt> {
  return (attemptStore.__isAdminLoginAttempts ??= new Map());
}

function pruneAttempts(now: number) {
  const store = attempts();
  for (const [ip, entry] of store) {
    if (now - entry.windowStart >= WINDOW_MS) store.delete(ip);
  }
  // Hard cap: if an attacker rotates IPs, drop the oldest entries rather than grow forever.
  if (store.size >= MAX_TRACKED_IPS) {
    const oldest = [...store.entries()].sort((a, b) => a[1].windowStart - b[1].windowStart);
    for (const [ip] of oldest.slice(0, Math.ceil(MAX_TRACKED_IPS / 10))) store.delete(ip);
  }
}

/** Five failed attempts per IP within 15 minutes locks that IP out until the window ends. */
export function checkLoginAllowed(ip: string, now = Date.now()): { allowed: boolean; retryAfterSeconds: number } {
  const entry = attempts().get(ip);
  if (!entry) return { allowed: true, retryAfterSeconds: 0 };
  if (now - entry.windowStart >= WINDOW_MS) {
    attempts().delete(ip);
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (entry.count >= MAX_FAILURES) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000) };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

export function recordLoginFailure(ip: string, now = Date.now()) {
  pruneAttempts(now);
  const store = attempts();
  const entry = store.get(ip);
  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    store.set(ip, { count: 1, windowStart: now });
  } else {
    entry.count += 1;
  }
}

export function clearLoginFailures(ip: string) {
  attempts().delete(ip);
}
