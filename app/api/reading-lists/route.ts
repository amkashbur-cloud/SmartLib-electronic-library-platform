import { NextRequest, NextResponse } from "next/server";
import { errorResponse, isErrorResponse, requireUser } from "@/lib/api-helpers";
import { createReadingList, listReadingListItems, listReadingListsByUser } from "@/lib/store";
import { required } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await requireUser();
  if (isErrorResponse(user)) return user;

  const lists = listReadingListsByUser(user.id).map((list) => ({
    ...list,
    items: listReadingListItems(list.id),
  }));
  return NextResponse.json({ items: lists });
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

  const name = String(body.name ?? "").trim();
  const description = String(body.description ?? "").trim();
  if (!required(name) || name.length > 100) return errorResponse(400, "invalid_name", "Give your reading list a name.");

  const list = createReadingList(user.id, name, description);
  return NextResponse.json({ list }, { status: 201 });
}
