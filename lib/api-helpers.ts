import { NextResponse } from "next/server";
import { getCurrentUser } from "./session";
import type { User } from "./types";

export function errorResponse(status: number, error: string, message: string) {
  return NextResponse.json({ error, message }, { status });
}

export async function requireUser(): Promise<User | NextResponse> {
  const user = await getCurrentUser();
  if (!user) return errorResponse(401, "unauthorized", "You must be signed in to do this.");
  return user;
}

export async function requireAdmin(): Promise<User | NextResponse> {
  const user = await getCurrentUser();
  if (!user) return errorResponse(401, "unauthorized", "You must be signed in to do this.");
  if (user.role !== "admin") return errorResponse(403, "forbidden", "Administrator access is required.");
  return user;
}

export function isErrorResponse(value: unknown): value is NextResponse {
  return value instanceof NextResponse;
}
