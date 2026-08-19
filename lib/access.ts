import type { Resource, User } from "./types";

export function canAccessResource(user: User | null, resource: Resource): { allowed: boolean; reason?: string } {
  if (!user) return { allowed: false, reason: "Sign in to read or download this resource." };
  if (resource.access_type === "Restricted" && user.role === "student") {
    return { allowed: false, reason: "This resource is restricted to researchers and administrators." };
  }
  return { allowed: true };
}
