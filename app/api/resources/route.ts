import { NextRequest, NextResponse } from "next/server";
import { createResource, listResources } from "@/lib/store";
import { errorResponse, isErrorResponse, requireAdmin } from "@/lib/api-helpers";
import { isOneOf, required } from "@/lib/validate";
import type { AccessType, Language, ResourceType } from "@/lib/types";

export const dynamic = "force-dynamic";

const RESOURCE_TYPES: ResourceType[] = ["E-Book", "Research Paper", "Thesis", "Journal Article", "Lecture Material", "Educational Resource"];
const ACCESS_TYPES: AccessType[] = ["Open Access", "Licensed", "Restricted", "Demo"];
const LANGUAGES: Language[] = ["English", "Arabic"];
const SORTS = ["newest", "oldest", "title", "rating", "popular"] as const;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const sortParam = sp.get("sort");
  const { items, total } = listResources({
    q: sp.get("q") ?? undefined,
    category_id: sp.get("category_id") ?? undefined,
    resource_type: sp.get("resource_type") ?? undefined,
    author_id: sp.get("author_id") ?? undefined,
    publication_year: sp.get("publication_year") ? Number(sp.get("publication_year")) : undefined,
    language: sp.get("language") ?? undefined,
    access_type: sp.get("access_type") ?? undefined,
    featured: sp.get("featured") === "1",
    sort: isOneOf(sortParam, SORTS) ? sortParam : "newest",
    page: sp.get("page") ? Number(sp.get("page")) : 1,
    pageSize: sp.get("pageSize") ? Number(sp.get("pageSize")) : 12,
  });
  return NextResponse.json({ items, total });
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

  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const isbn = String(body.isbn ?? "").trim();
  const author_id = String(body.author_id ?? "");
  const category_id = String(body.category_id ?? "");
  const publication_year = Number(body.publication_year);
  const resource_type = body.resource_type;
  const language = body.language;
  const access_type = body.access_type;
  const featured = Boolean(body.featured);

  if (!required(title) || title.length > 200) return errorResponse(400, "invalid_title", "Title is required (max 200 characters).");
  if (!required(description) || description.length > 2000) return errorResponse(400, "invalid_description", "Description is required (max 2000 characters).");
  if (!required(author_id)) return errorResponse(400, "invalid_author", "Select an author.");
  if (!required(category_id)) return errorResponse(400, "invalid_category", "Select a category.");
  if (!Number.isFinite(publication_year) || publication_year < 1900 || publication_year > new Date().getFullYear() + 1) {
    return errorResponse(400, "invalid_year", "Enter a valid publication year.");
  }
  if (!isOneOf(resource_type, RESOURCE_TYPES)) return errorResponse(400, "invalid_resource_type", "Select a valid resource type.");
  if (!isOneOf(language, LANGUAGES)) return errorResponse(400, "invalid_language", "Select a valid language.");
  if (!isOneOf(access_type, ACCESS_TYPES)) return errorResponse(400, "invalid_access_type", "Select a valid access type.");

  const COVER_COLORS = ["#2563eb", "#0ea5e9", "#4f46e5", "#0891b2", "#059669", "#7c3aed", "#dc2626", "#d97706"];
  const resource = createResource({
    title,
    description,
    resource_type,
    author_id,
    category_id,
    isbn: isbn || "N/A",
    publication_year,
    language,
    cover_color: COVER_COLORS[Math.floor(Math.random() * COVER_COLORS.length)],
    file_url: "/demo-document",
    access_type,
    featured,
  });

  return NextResponse.json({ resource }, { status: 201 });
}
