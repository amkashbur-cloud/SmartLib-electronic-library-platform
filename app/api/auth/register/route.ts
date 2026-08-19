import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, hashPassword, SESSION_COOKIE_MAX_AGE, SESSION_COOKIE_NAME } from "@/lib/auth";
import { createUser, findUserByEmail } from "@/lib/store";
import { isOneOf, isValidEmail, isValidPassword, required } from "@/lib/validate";
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

  const full_name = String(body.full_name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const account_type = body.account_type;

  if (!required(full_name) || full_name.length > 100) {
    return errorResponse(400, "invalid_full_name", "Please enter your full name.");
  }
  if (!isValidEmail(email)) {
    return errorResponse(400, "invalid_email", "Please enter a valid email address.");
  }
  if (!isValidPassword(password)) {
    return errorResponse(400, "invalid_password", "Password must be at least 8 characters.");
  }
  if (!isOneOf(account_type, ["student", "researcher"] as const)) {
    return errorResponse(400, "invalid_account_type", "Choose either Student or Researcher.");
  }
  if (findUserByEmail(email)) {
    return errorResponse(400, "email_taken", "An account with this email already exists.");
  }

  const user = createUser({
    full_name,
    email,
    password_hash: hashPassword(password),
    role: account_type,
  });

  const token = createSessionToken(user.id);
  const res = NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_COOKIE_MAX_AGE,
    path: "/",
  });
  return res;
}
