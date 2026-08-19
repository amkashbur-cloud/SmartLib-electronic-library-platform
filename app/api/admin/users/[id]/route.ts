import { NextRequest, NextResponse } from "next/server";
import { errorResponse, isErrorResponse, requireAdmin } from "@/lib/api-helpers";
import { findUserById, updateUser } from "@/lib/store";
import { isOneOf } from "@/lib/validate";
import { toPublicUser, type AccountStatus, type Role } from "@/lib/types";

export const dynamic = "force-dynamic";

const ROLES: Role[] = ["student", "researcher", "admin"];
const STATUSES: AccountStatus[] = ["active", "suspended"];

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/admin/users/[id]">) {
  const admin = await requireAdmin();
  if (isErrorResponse(admin)) return admin;

  const { id } = await ctx.params;
  const existing = findUserById(id);
  if (!existing) return errorResponse(404, "not_found", "User not found.");

  if (id === admin.id) {
    return errorResponse(400, "cannot_edit_self", "You cannot change your own role or status here.");
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, "invalid_json", "The request body must be valid JSON.");
  }

  const patch: Record<string, unknown> = {};
  if (body.role !== undefined) {
    if (!isOneOf(body.role, ROLES)) return errorResponse(400, "invalid_role", "Select a valid role.");
    patch.role = body.role;
  }
  if (body.account_status !== undefined) {
    if (!isOneOf(body.account_status, STATUSES)) return errorResponse(400, "invalid_status", "Select a valid account status.");
    patch.account_status = body.account_status;
  }

  const updated = updateUser(id, patch);
  return NextResponse.json({ user: toPublicUser(updated!) });
}
