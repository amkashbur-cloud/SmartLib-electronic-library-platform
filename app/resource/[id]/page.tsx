import { notFound } from "next/navigation";
import { CoverArt } from "@/components/CoverArt";
import { ResourceCard } from "@/components/ResourceCard";
import { RatingStars } from "@/components/RatingStars";
import { FavoriteButton } from "@/components/FavoriteButton";
import { DownloadButton } from "@/components/DownloadButton";
import { AddToListButton } from "@/components/AddToListButton";
import { ReviewSection } from "@/components/ReviewSection";
import { Badge, ButtonLink } from "@/components/ui";
import { BookIcon } from "@/components/Icons";
import { canAccessResource } from "@/lib/access";
import { getCurrentUser } from "@/lib/session";
import {
  averageRating,
  findAuthorById,
  findCategoryById,
  findResourceById,
  findUserById,
  isFavorite,
  listResources,
  listReviewsByResource,
  findReviewByUserAndResource,
} from "@/lib/store";
import { enrichResources } from "@/lib/resource-view";

const ACCESS_TONE: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  "Open Access": "success",
  Licensed: "warning",
  Restricted: "danger",
  Demo: "neutral",
};

export default async function ResourceDetailsPage({ params }: PageProps<"/resource/[id]">) {
  const { id } = await params;
  const resource = findResourceById(id);
  if (!resource) notFound();

  const user = await getCurrentUser();
  const author = findAuthorById(resource.author_id);
  const category = findCategoryById(resource.category_id);
  const rating = averageRating(resource.id);
  const reviews = listReviewsByResource(resource.id);
  const access = canAccessResource(user, resource);

  const authorNames: Record<string, string> = {};
  for (const r of reviews) {
    const u = findUserById(r.user_id);
    if (u) authorNames[r.user_id] = u.full_name;
  }
  const myReview = user ? findReviewByUserAndResource(user.id, resource.id) ?? null : null;

  const related = enrichResources(
    listResources({ category_id: resource.category_id, pageSize: 5 }).items.filter((r) => r.id !== resource.id).slice(0, 4)
  );

  return (
    <div className="container-page py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[280px_1fr]">
        <div>
          <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-100 shadow-sm">
            <CoverArt title={resource.title} color={resource.cover_color} className="h-full w-full" />
          </div>
          <div className="mt-4 space-y-2">
            {user ? (
              <>
                <ButtonLink href={`/reader/${resource.id}`} className="w-full" disabled={!access.allowed}>
                  <BookIcon className="h-4 w-4" /> Read now
                </ButtonLink>
                <DownloadButton resourceId={resource.id} allowed={access.allowed} signedIn={!!user} />
              </>
            ) : (
              <>
                <ButtonLink href="/login" className="w-full">
                  <BookIcon className="h-4 w-4" /> Sign in to read
                </ButtonLink>
                <DownloadButton resourceId={resource.id} allowed={false} signedIn={false} />
              </>
            )}
            <FavoriteButton resourceId={resource.id} initialFavorited={user ? isFavorite(user.id, resource.id) : false} signedIn={!!user} />
            <AddToListButton resourceId={resource.id} signedIn={!!user} />
          </div>
          {!access.allowed && <p className="mt-2 text-xs text-danger">{access.reason}</p>}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={ACCESS_TONE[resource.access_type] ?? "neutral"}>{resource.access_type}</Badge>
            <Badge tone="brand">{resource.resource_type}</Badge>
            {resource.featured && <Badge tone="warning">Featured</Badge>}
          </div>
          <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">{resource.title}</h1>
          {author && (
            <p className="mt-1 text-base text-muted">
              by <span className="font-medium text-foreground">{author.name}</span>
            </p>
          )}
          <div className="mt-2 flex items-center gap-2">
            <RatingStars value={Math.round(rating)} readOnly />
            <span className="text-sm text-muted">{rating > 0 ? rating.toFixed(1) : "No ratings yet"} ({reviews.length} reviews)</span>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-surface p-4 text-sm sm:grid-cols-3">
            <Field label="Category" value={category?.name ?? "Uncategorized"} />
            <Field label="Publication year" value={String(resource.publication_year)} />
            <Field label="Language" value={resource.language} />
            <Field label="ISBN" value={resource.isbn} />
            <Field label="Availability" value={access.allowed ? "Available" : "Restricted"} />
            <Field label="Access type" value={resource.access_type} />
          </dl>

          <div className="mt-6">
            <h2 className="text-base font-semibold text-foreground">Description</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{resource.description}</p>
          </div>

          {author?.biography && (
            <div className="mt-6">
              <h2 className="text-base font-semibold text-foreground">About the author</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{author.biography}</p>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-base font-semibold text-foreground">Reviews</h2>
            <div className="mt-3">
              <ReviewSection resourceId={resource.id} reviews={reviews} authorNames={authorNames} signedIn={!!user} myReview={myReview} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-foreground">Related resources</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map(({ resource: r, author: a, category: c, rating: rt, reviewCount }) => (
              <ResourceCard key={r.id} resource={r} author={a} category={c} rating={rt} reviewCount={reviewCount} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
