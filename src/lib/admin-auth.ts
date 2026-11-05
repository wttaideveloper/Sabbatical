export const ADMIN_SESSION_COOKIE = "is_admin_session";

const encoder = new TextEncoder();

async function sha256Hex(input: string): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(input));
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * The session cookie value is a hash derived from the admin password + a
 * separate secret, rather than the password itself, so the cookie alone
 * doesn't reveal the password and can't be replayed if the secret rotates.
 */
export async function getExpectedSessionToken(): Promise<string | null> {
  const password = process.env.ADMIN_PANEL_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret) return null;
  return sha256Hex(`${password}:${secret}`);
}

export function isAdminPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PANEL_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

export function verifyPassword(input: string): boolean {
  const password = process.env.ADMIN_PANEL_PASSWORD;
  return Boolean(password) && input === password;
}
