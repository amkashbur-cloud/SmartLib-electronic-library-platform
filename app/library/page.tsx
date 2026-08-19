import { LibraryFilters } from "@/components/LibraryFilters";
import { Pagination } from "@/components/Pagination";
import { ResourceCard } from "@/components/ResourceCard";
import { EmptyState } from "@/components/ui";
import { enrichResources } from "@/lib/resource-view";
import { listAuthors, listCategories, listResources } from "@/lib/store";

const PAGE_SIZE = 12;

export default async function LibraryPage({ searchParams }: PageProps<"/library">) {
  const sp = await searchParams;
  const get = (key: string) => (Array.isArray(sp[key]) ? sp[key]?.[0] : sp[key]);

  const page = Number(get("page") ?? 1) || 1;
  const filters = {
    q: get("q") || undefined,
    category_id: get("category_id") || undefined,
    resource_type: get("resource_type") || undefined,
    author_id: get("author_id") || undefined,
    publication_year: get("publication_year") ? Number(get("publication_year")) : undefined,
    language: get("language") || undefined,
    access_type: get("access_type") || undefined,
    featured: get("featured") === "1",
    sort: (get("sort") as "newest" | "oldest" | "title" | "rating" | "popular" | undefined) ?? "newest",
    page,
    pageSize: PAGE_SIZE,
  };

  const { items, total } = listResources(filters);
  const enriched = enrichResources(items);
  const categories = listCategories();
  const authors = listAuthors();
  const years = [...new Set(listResources({ pageSize: 1000 }).items.map((r) => r.publication_year))].sort((a, b) => b - a);

  const current: Record<string, string | undefined> = {
    q: get("q"),
    category_id: get("category_id"),
    resource_type: get("resource_type"),
    author_id: get("author_id"),
    publication_year: get("publication_year"),
    language: get("language"),
    access_type: get("access_type"),
    sort: get("sort"),
  };

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Library</h1>
        <p className="mt-1 text-sm text-muted">
          {total} {total === 1 ? "resource" : "resources"} available
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
        <aside>
          <LibraryFilters categories={categories} authors={authors} years={years} current={current} />
        </aside>

        <div>
          {enriched.length === 0 ? (
            <EmptyState
              title="No resources match your filters"
              description="Try broadening your search or clearing a few filters."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {enriched.map(({ resource, author, category, rating, reviewCount }) => (
                <ResourceCard key={resource.id} resource={resource} author={author} category={category} rating={rating} reviewCount={reviewCount} />
              ))}
            </div>
          )}
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} basePath="/library" searchParams={current} />
        </div>
      </div>
    </div>
  );
}
