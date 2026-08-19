import { NextRequest, NextResponse } from "next/server";
import { errorResponse, isErrorResponse, requireUser } from "@/lib/api-helpers";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { getDb, updateUser } from "@/lib/store";
import { isValidPassword, required } from "@/lib/validate";
import { toPublicUser } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const user = await requireUser();
  if (isErrorResponse(user)) return user;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, "invalid_json", "The request body must be valid JSON.");
  }

  if (body.full_name !== undefined) {
    const full_name = String(body.full_name).trim();
    if (!required(full_name) || full_name.length > 100) return errorResponse(400, "invalid_full_name", "Enter a valid name.");
    updateUser(user.id, { full_name });
  }

  if (body.new_password !== undefined) {
    const current_password = String(body.current_password ?? "");
    const new_password = String(body.new_password ?? "");
    if (!verifyPassword(current_password, user.password_hash)) {
      return errorResponse(400, "invalid_current_password", "Current password is incorrect.");
    }
    if (!isValidPassword(new_password)) {
      return errorResponse(400, "invalid_password", "New password must be at least 8 characters.");
    }
    const dbUser = getDb().users.find((u) => u.id === user.id)!;
    dbUser.password_hash = hashPassword(new_password);
  }

  const refreshed = getDb().users.find((u) => u.id === user.id)!;
  return NextResponse.json({ user: toPublicUser(refreshed) });
}
