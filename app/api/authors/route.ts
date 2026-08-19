import { NextRequest, NextResponse } from "next/server";
import { createAuthor, listAuthors } from "@/lib/store";
import { errorResponse, isErrorResponse, requireAdmin } from "@/lib/api-helpers";
import { required } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ items: listAuthors() });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (isErrorResponse(admin)) return admin;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, "invalid_json", "The request body must be valid JSON.");
  }

  const name = String(body.name ?? "").trim();
  const biography = String(body.biography ?? "").trim();
  if (!required(name) || name.length > 120) return errorResponse(400, "invalid_name", "Author name is required.");

  const author = createAuthor({ name, biography });
  return NextResponse.json({ author }, { status: 201 });
}
