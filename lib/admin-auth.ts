import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "sfj_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? "ship-fusion-demo-session-secret-change-before-production";

export type AdminSession = {
  adminId: string;
  role: "admin";
  issuedAt: number;
  expiresAt: number;
};

function sign(value: string): string {
  return createHmac("sha256", SESSION_SECRET).update(value).digest("base64url");
}

export function verifyDemoAdminCredentials(email: string, password: string): boolean {
  const expectedEmail = (process.env.ADMIN_DEMO_EMAIL ?? "admin@shipfusionja.com").trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_DEMO_PASSWORD ?? "FusionAdmin26!";
  return constantTimeEqual(email.trim().toLowerCase(), expectedEmail) && constantTimeEqual(password, expectedPassword);
}

export function createAdminSessionToken(adminId = "admin-001"): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSession = {
    adminId,
    role: "admin",
    issuedAt: now,
    expiresAt: now + ADMIN_SESSION_MAX_AGE_SECONDS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifyAdminSessionToken(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const [encodedPayload, signature, extra] = token.split(".");
  if (!encodedPayload || !signature || extra) return null;

  const expectedSignature = sign(encodedPayload);
  if (!constantTimeEqual(signature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as AdminSession;
    if (payload.role !== "admin" || payload.adminId !== "admin-001" || payload.expiresAt <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function constantTimeEqual(leftValue: string, rightValue: string): boolean {
  const left = Buffer.from(leftValue);
  const right = Buffer.from(rightValue);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
