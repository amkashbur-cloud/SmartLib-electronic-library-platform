import { NextRequest, NextResponse } from "next/server";
import { createCategory, listCategories } from "@/lib/store";
import { errorResponse, isErrorResponse, requireAdmin } from "@/lib/api-helpers";
import { required } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ items: listCategories() });
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
  const description = String(body.description ?? "").trim();
  if (!required(name) || name.length > 80) return errorResponse(400, "invalid_name", "Category name is required.");

  const category = createCategory({ name, description });
  return NextResponse.json({ category }, { status: 201 });
}
