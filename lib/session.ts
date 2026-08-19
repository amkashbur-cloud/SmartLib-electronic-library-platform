import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./auth";
import { findUserById } from "./store";
import type { User } from "./types";

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  const uid = verifySessionToken(token);
  if (!uid) return null;
  const user = findUserById(uid);
  if (!user || user.account_status !== "active") return null;
  return user;
}
