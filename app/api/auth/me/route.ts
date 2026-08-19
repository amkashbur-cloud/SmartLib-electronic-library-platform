import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { toPublicUser } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user: toPublicUser(user) });
}
