import { NextResponse } from "next/server";
import { errorResponse, isErrorResponse, requireUser } from "@/lib/api-helpers";
import { deleteReview, getDb } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, ctx: RouteContext<"/api/reviews/[id]">) {
  const user = await requireUser();
  if (isErrorResponse(user)) return user;

  const { id } = await ctx.params;
  const review = getDb().reviews.find((r) => r.id === id);
  if (!review) return errorResponse(404, "not_found", "Review not found.");
  if (review.user_id !== user.id && user.role !== "admin") {
    return errorResponse(403, "forbidden", "You can only delete your own review.");
  }
  deleteReview(id);
  return NextResponse.json({ ok: true });
}
