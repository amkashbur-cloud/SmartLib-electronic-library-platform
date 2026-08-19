import Link from "next/link";
import { CoverArt } from "./CoverArt";
import { Badge } from "./ui";
import { RatingStars } from "./RatingStars";
import type { Author, Category, Resource } from "@/lib/types";

const ACCESS_TONE: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  "Open Access": "success",
  Licensed: "warning",
  Restricted: "danger",
  Demo: "neutral",
};

export function ResourceCard({
  resource,
  author,
  category,
  rating,
  reviewCount,
}: {
  resource: Resource;
  author?: Author;
  category?: Category;
  rating: number;
  reviewCount: number;
}) {
  return (
    <Link
      href={`/resource/${resource.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[3/4] w-full bg-slate-100">
        <CoverArt title={resource.title} color={resource.cover_color} className="h-full w-full" />
        {resource.featured && (
          <span className="absolute left-2 top-2">
            <Badge tone="brand">Featured</Badge>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-muted">
          <span>{resource.resource_type}</span>
          <Badge tone={ACCESS_TONE[resource.access_type] ?? "neutral"}>{resource.access_type}</Badge>
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-brand">{resource.title}</h3>
        <p className="text-xs text-muted">{author?.name ?? "Unknown author"}</p>
        {category && <p className="text-xs text-muted">{category.name}</p>}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            <RatingStars value={Math.round(rating)} readOnly size="sm" />
            <span className="text-xs text-muted">({reviewCount})</span>
          </div>
          <span className="text-xs text-muted">{resource.publication_year}</span>
        </div>
      </div>
    </Link>
  );
}
