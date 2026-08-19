import { NextRequest, NextResponse } from "next/server";
import { errorResponse, isErrorResponse, requireUser } from "@/lib/api-helpers";
import { findResourceById, upsertReadingProgress } from "@/lib/store";
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
  if (!required(resource_id) || !findResourceById(resource_id)) {
    return errorResponse(404, "not_found", "Resource not found.");
  }

  const progress = body.progress !== undefined ? Math.max(0, Math.min(100, Number(body.progress))) : undefined;
  const last_page = body.last_page !== undefined ? Math.max(1, Number(body.last_page)) : undefined;
  const reading_time = body.reading_time !== undefined ? Math.max(0, Number(body.reading_time)) : undefined;

  const entry = upsertReadingProgress(user.id, resource_id, { progress, last_page, reading_time });
  return NextResponse.json({ entry });
}
