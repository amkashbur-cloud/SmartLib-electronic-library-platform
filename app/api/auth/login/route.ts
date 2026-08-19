import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, verifyPassword, SESSION_COOKIE_MAX_AGE, SESSION_COOKIE_NAME } from "@/lib/auth";
import { findUserByEmail } from "@/lib/store";
import { errorResponse } from "@/lib/api-helpers";
import { toPublicUser } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, "invalid_json", "The request body must be valid JSON.");
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const remember = Boolean(body.remember);

  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return errorResponse(400, "invalid_credentials", "Incorrect email or password.");
  }
  if (user.account_status !== "active") {
    return errorResponse(403, "account_suspended", "This account has been deactivated. Contact an administrator.");
  }

  const token = createSessionToken(user.id);
  const res = NextResponse.json({ user: toPublicUser(user) });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: remember ? SESSION_COOKIE_MAX_AGE : undefined,
    path: "/",
  });
  return res;
}
