import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET || "smartlib-dev-secret-change-me";
const SESSION_COOKIE = "smartlib_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");
  if (derived.length !== keyBuffer.length) return false;
  return timingSafeEqual(derived, keyBuffer);
}

interface SessionPayload {
  uid: string;
  exp: number; // unix seconds
}

function sign(data: string): string {
  return createHmac("sha256", SESSION_SECRET).update(data).digest("hex");
}

export function createSessionToken(userId: string): string {
  const payload: SessionPayload = {
    uid: userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(data);
  return `${data}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;
  const expected = sign(data);
  const sigBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }
  try {
    const payload: SessionPayload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload.uid;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const SESSION_COOKIE_MAX_AGE = SESSION_MAX_AGE_SECONDS;
