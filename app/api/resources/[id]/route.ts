import { NextRequest, NextResponse } from "next/server";
import { deleteResource, findResourceById, updateResource } from "@/lib/store";
import { errorResponse, isErrorResponse, requireAdmin } from "@/lib/api-helpers";
import { isOneOf } from "@/lib/validate";
import type { AccessType, Language, ResourceType } from "@/lib/types";

export const dynamic = "force-dynamic";

const RESOURCE_TYPES: ResourceType[] = ["E-Book", "Research Paper", "Thesis", "Journal Article", "Lecture Material", "Educational Resource"];
const ACCESS_TYPES: AccessType[] = ["Open Access", "Licensed", "Restricted", "Demo"];
const LANGUAGES: Language[] = ["English", "Arabic"];

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/resources/[id]">) {
  const { id } = await ctx.params;
  const resource = findResourceById(id);
  if (!resource) return errorResponse(404, "not_found", "Resource not found.");
  return NextResponse.json({ resource });
}

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/resources/[id]">) {
  const admin = await requireAdmin();
  if (isErrorResponse(admin)) return admin;

  const { id } = await ctx.params;
  const existing = findResourceById(id);
  if (!existing) return errorResponse(404, "not_found", "Resource not found.");

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, "invalid_json", "The request body must be valid JSON.");
  }

  const patch: Record<string, unknown> = {};
  if (body.title !== undefined) {
    const title = String(body.title).trim();
    if (!title || title.length > 200) return errorResponse(400, "invalid_title", "Title is required (max 200 characters).");
    patch.title = title;
  }
  if (body.description !== undefined) {
    const description = String(body.description).trim();
    if (!description || description.length > 2000) return errorResponse(400, "invalid_description", "Description is required.");
    patch.description = description;
  }
  if (body.author_id !== undefined) patch.author_id = String(body.author_id);
  if (body.category_id !== undefined) patch.category_id = String(body.category_id);
  if (body.isbn !== undefined) patch.isbn = String(body.isbn);
  if (body.publication_year !== undefined) {
    const year = Number(body.publication_year);
    if (!Number.isFinite(year) || year < 1900 || year > new Date().getFullYear() + 1) {
      return errorResponse(400, "invalid_year", "Enter a valid publication year.");
    }
    patch.publication_year = year;
  }
  if (body.resource_type !== undefined) {
    if (!isOneOf(body.resource_type, RESOURCE_TYPES)) return errorResponse(400, "invalid_resource_type", "Select a valid resource type.");
    patch.resource_type = body.resource_type;
  }
  if (body.language !== undefined) {
    if (!isOneOf(body.language, LANGUAGES)) return errorResponse(400, "invalid_language", "Select a valid language.");
    patch.language = body.language;
  }
  if (body.access_type !== undefined) {
    if (!isOneOf(body.access_type, ACCESS_TYPES)) return errorResponse(400, "invalid_access_type", "Select a valid access type.");
    patch.access_type = body.access_type;
  }
  if (body.featured !== undefined) patch.featured = Boolean(body.featured);

  const updated = updateResource(id, patch);
  return NextResponse.json({ resource: updated });
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/resources/[id]">) {
  const admin = await requireAdmin();
  if (isErrorResponse(admin)) return admin;

  const { id } = await ctx.params;
  const ok = deleteResource(id);
  if (!ok) return errorResponse(404, "not_found", "Resource not found.");
  return NextResponse.json({ ok: true });
}
