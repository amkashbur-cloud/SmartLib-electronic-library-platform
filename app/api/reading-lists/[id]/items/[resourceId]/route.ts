import { NextResponse } from "next/server";
import { errorResponse, isErrorResponse, requireUser } from "@/lib/api-helpers";
import { findReadingListById, removeReadingListItem } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, ctx: RouteContext<"/api/reading-lists/[id]/items/[resourceId]">) {
  const user = await requireUser();
  if (isErrorResponse(user)) return user;

  const { id, resourceId } = await ctx.params;
  const list = findReadingListById(id);
  if (!list) return errorResponse(404, "not_found", "Reading list not found.");
  if (list.user_id !== user.id) return errorResponse(403, "forbidden", "This isn't your reading list.");

  removeReadingListItem(id, resourceId);
  return NextResponse.json({ ok: true });
}
