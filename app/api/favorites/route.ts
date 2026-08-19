import { NextRequest, NextResponse } from "next/server";
import { errorResponse, isErrorResponse, requireUser } from "@/lib/api-helpers";
import { findResourceById, listFavoritesByUser, toggleFavorite } from "@/lib/store";
import { required } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await requireUser();
  if (isErrorResponse(user)) return user;
  return NextResponse.json({ items: listFavoritesByUser(user.id) });
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (isErrorResponse(user)) return user;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, "invalid_json", "The request body must be valid JSON.");
  }

  const resource_id = String(body.resource_id ?? "");
  if (!required(resource_id) || !findResourceById(resource_id)) {
    return errorResponse(404, "not_found", "Resource not found.");
  }

  const favorited = toggleFavorite(user.id, resource_id);
  return NextResponse.json({ favorited });
}
