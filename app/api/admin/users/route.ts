import { NextResponse } from "next/server";
import { isErrorResponse, requireAdmin } from "@/lib/api-helpers";
import { listUsers } from "@/lib/store";
import { toPublicUser } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (isErrorResponse(admin)) return admin;
  return NextResponse.json({ items: listUsers().map(toPublicUser) });
}
