import { NextRequest, NextResponse } from "next/server";
import { errorResponse, isErrorResponse, requireUser } from "@/lib/api-helpers";
import { createReview, deleteReview, findReviewByUserAndResource, findResourceById } from "@/lib/store";
import { required } from "@/lib/validate";

export const dynamic = "force-dynamic";

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
  const rating = Number(body.rating);
  const comment = String(body.comment ?? "").trim();

  if (!required(resource_id) || !findResourceById(resource_id)) {
    return errorResponse(404, "not_found", "Resource not found.");
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return errorResponse(400, "invalid_rating", "Rating must be between 1 and 5.");
  }
  if (comment.length > 1000) {
    return errorResponse(400, "invalid_comment", "Review comment is too long.");
  }

  const existing = findReviewByUserAndResource(user.id, resource_id);
  if (existing) deleteReview(existing.id);

  const review = createReview({ user_id: user.id, resource_id, rating, comment });
  return NextResponse.json({ review }, { status: 201 });
}
