import { NextRequest, NextResponse } from "next/server";
import { errorResponse, isErrorResponse, requireUser } from "@/lib/api-helpers";
import { addReadingListItem, findReadingListById, findResourceById, listReadingListItems } from "@/lib/store";
import { required } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: RouteContext<"/api/reading-lists/[id]/items">) {
  const user = await requireUser();
  if (isErrorResponse(user)) return user;

  const { id } = await ctx.params;
  const list = findReadingListById(id);
  if (!list) return errorResponse(404, "not_found", "Reading list not found.");
  if (list.user_id !== user.id) return errorResponse(403, "forbidden", "This isn't your reading list.");

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, "invalid_json", "The request body must be valid JSON.");
  }

  const resource_id = String(body.resource_id ?? "");
  if (!required(resource_id) || !findResourceById(resource_id)) {
    return errorResponse(404, "resource_not_found", "Resource not found.");
  }

  if (listReadingListItems(id).some((i) => i.resource_id === resource_id)) {
    return errorResponse(400, "already_added", "This resource is already in the list.");
  }

  const item = addReadingListItem(id, resource_id);
  return NextResponse.json({ item }, { status: 201 });
}
