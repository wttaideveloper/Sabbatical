/**
 * Admin session primitives for the custom /admin panel.
 *
 * Deliberately dependency-free (Web Crypto only, no `next/*` imports) so the exact
 * same verification code runs in `src/proxy.ts` and in server actions.
 *
 * Token format:  v1.<sessionId>.<expiresAtEpochSeconds>.<hmacSignature>
 *   - sessionId   random 128-bit nonce (base64url), unique per login
 *   - expiresAt   validated server-side on every request (the cookie's maxAge is
 *                 only a browser hint and is never trusted)
 *   - signature   HMAC-SHA256 over "v1.<id>.<exp>". The signing key is derived from
 *                 ADMIN_SESSION_SECRET *and* ADMIN_PANEL_PASSWORD, so rotating either
 *                 one invalidates every outstanding session.
 *
 * Sessions are stateless (no Redis/DB). Logout additionally records the session ID
 * in a small in-process revocation list until the token would have expired anyway.
 * That list lives in `globalThis` so the proxy bundle and the app bundle share it.
 * It is per-process by design: this deployment runs a single `web` replica.
 */

export const ADMIN_SESSION_COOKIE = "is_admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 12 * 60 * 60; // 12 hours

const TOKEN_VERSION = "v1";
const encoder = new TextEncoder();

const MIN_SECRET_LENGTH = 32;
const MIN_PASSWORD_LENGTH = 12;

export type AdminConfigStatus = "ok" | "missing" | "weak";

type AdminConfig = { password: string; secret: string };

function readConfig(): { status: AdminConfigStatus; config: AdminConfig | null } {
  const password = process.env.ADMIN_PANEL_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret) return { status: "missing", config: null };

  // In production, refuse to run with trivially guessable credentials.
  if (
    process.env.NODE_ENV === "production" &&
    (secret.length < MIN_SECRET_LENGTH || password.length < MIN_PASSWORD_LENGTH)
  ) {
    return { status: "weak", config: null };
  }
  return { status: "ok", config: { password, secret } };
}

export function getAdminConfigStatus(): AdminConfigStatus {
  return readConfig().status;
}

// ---------- encoding helpers ----------

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array | null {
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

async function hmacSha256(key: string, message: string): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message)));
}

/** Constant-time byte comparison. Always walks the longer input; never early-exits. */
export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  let diff = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) {
    diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  }
  return diff === 0;
}

function signingKey(config: AdminConfig): string {
  return `${config.secret}\u0000${config.password}`;
}

// ---------- password check ----------

/**
 * Compares HMAC digests of the submitted and configured password rather than the
 * raw strings, so the comparison is constant-time and independent of password length.
 */
export async function passwordMatches(input: string): Promise<boolean> {
  const { config } = readConfig();
  if (!config) return false;
  const [submitted, expected] = await Promise.all([
    hmacSha256(config.secret, `pw:${input}`),
    hmacSha256(config.secret, `pw:${config.password}`),
  ]);
  return constantTimeEqual(submitted, expected);
}

// ---------- revocation (logout) ----------

const revocationStore = globalThis as typeof globalThis & {
  __isAdminRevokedSessions?: Map<string, number>;
};

function revocations(): Map<string, number> {
  return (revocationStore.__isAdminRevokedSessions ??= new Map());
}

function pruneRevocations(nowSeconds: number) {
  const store = revocations();
  for (const [id, expiresAt] of store) {
    if (expiresAt <= nowSeconds) store.delete(id);
  }
}

export type AdminSession = { id: string; expiresAt: number };

export function revokeSession(session: AdminSession, nowMs = Date.now()) {
  const nowSeconds = Math.floor(nowMs / 1000);
  pruneRevocations(nowSeconds);
  revocations().set(session.id, session.expiresAt);
}

// ---------- token create / verify ----------

export async function createSessionToken(
  nowMs = Date.now()
): Promise<{ token: string; session: AdminSession } | null> {
  const { config } = readConfig();
  if (!config) return null;

  const id = toBase64Url(crypto.getRandomValues(new Uint8Array(16)));
  const expiresAt = Math.floor(nowMs / 1000) + ADMIN_SESSION_TTL_SECONDS;
  const payload = `${TOKEN_VERSION}.${id}.${expiresAt}`;
  const signature = toBase64Url(await hmacSha256(signingKey(config), payload));

  return { token: `${payload}.${signature}`, session: { id, expiresAt } };
}

export async function verifySessionToken(
  token: string | undefined | null,
  nowMs = Date.now()
): Promise<AdminSession | null> {
  if (!token || token.length > 512) return null;
  const { config } = readConfig();
  if (!config) return null;

  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [version, id, expRaw, signature] = parts;
  if (version !== TOKEN_VERSION) return null;
  if (!/^[A-Za-z0-9_-]{16,32}$/.test(id)) return null;
  if (!/^\d{1,12}$/.test(expRaw)) return null;

  const providedSignature = fromBase64Url(signature);
  if (!providedSignature) return null;

  const expectedSignature = await hmacSha256(signingKey(config), `${version}.${id}.${expRaw}`);
  if (!constantTimeEqual(providedSignature, expectedSignature)) return null;

  const expiresAt = Number(expRaw);
  const nowSeconds = Math.floor(nowMs / 1000);
  if (expiresAt <= nowSeconds) return null;

  const revokedUntil = revocations().get(id);
  if (revokedUntil !== undefined) {
    if (revokedUntil > nowSeconds) return null;
    revocations().delete(id);
  }

  return { id, expiresAt };
}

// ---------- redirect safety ----------

/** Only ever redirect to a same-site /admin path. Anything else falls back to /admin. */
export function safeAdminPath(raw: string | null | undefined): string {
  if (!raw || raw.length > 512) return "/admin";
  if (/[\u0000-\u001f\u007f\\]/.test(raw)) return "/admin";
  if (!/^\/admin(?:[/?#].*)?$/.test(raw)) return "/admin";
  if (raw.startsWith("/admin//")) return "/admin";
  return raw;
}
