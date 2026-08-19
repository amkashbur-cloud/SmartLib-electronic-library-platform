import Link from "next/link";
import { redirect } from "next/navigation";
import { ResourceCard } from "@/components/ResourceCard";
import { ReadingListsPanel } from "@/components/ReadingListsPanel";
import { EmptyState } from "@/components/ui";
import { getCurrentUser } from "@/lib/session";
import { enrichResource } from "@/lib/resource-view";
import { findResourceById, getDb, listFavoritesByUser, listReadingHistoryByUser } from "@/lib/store";
import { formatDate } from "@/lib/format";

export default async function MyLibraryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const history = listReadingHistoryByUser(user.id);
  const currentlyReading = history.filter((h) => h.progress < 100).slice(0, 6);
  const favorites = listFavoritesByUser(user.id)
    .map((f) => findResourceById(f.resource_id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const resourceLookup = Object.fromEntries(getDb().resources.map((r) => [r.id, r]));

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-foreground">My Library</h1>
      <p className="mt-1 text-sm text-muted">Everything you&apos;re reading, saving, and tracking.</p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">Currently Reading</h2>
        {currentlyReading.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="Nothing in progress" description="Open a resource and start reading — your progress will show up here." />
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {currentlyReading.map((h) => {
              const resource = findResourceById(h.resource_id);
              if (!resource) return null;
              return (
                <Link
                  key={h.id}
                  href={`/reader/${resource.id}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4 hover:border-brand"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{resource.title}</p>
                    <p className="text-xs text-muted">Page {h.last_page} · last opened {formatDate(h.last_accessed)}</p>
                  </div>
                  <div className="flex w-32 shrink-0 flex-col items-end gap-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full bg-brand" style={{ width: `${h.progress}%` }} />
                    </div>
                    <span className="text-xs text-muted">{h.progress}%</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">Favorites</h2>
        {favorites.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="No favorites yet" description="Tap the heart on any resource to save it here." />
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {favorites.map((resource) => {
              const { author, category, rating, reviewCount } = enrichResource(resource);
              return <ResourceCard key={resource.id} resource={resource} author={author} category={category} rating={rating} reviewCount={reviewCount} />;
            })}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">Reading Lists</h2>
        <p className="text-sm text-muted">Organize saved resources into lists for a course or project.</p>
        <div className="mt-3">
          <ReadingListsPanel resourceLookup={resourceLookup} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">Reading History</h2>
        {history.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="No reading history yet" description="Resources you open in the reader will be logged here." />
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs text-muted">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Resource</th>
                  <th className="px-4 py-2.5 font-medium">Progress</th>
                  <th className="px-4 py-2.5 font-medium">Reading time</th>
                  <th className="px-4 py-2.5 font-medium">Last accessed</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => {
                  const resource = findResourceById(h.resource_id);
                  return (
                    <tr key={h.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5">
                        {resource ? (
                          <Link href={`/resource/${resource.id}`} className="text-foreground hover:text-brand">{resource.title}</Link>
                        ) : (
                          "Removed resource"
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-muted">{h.progress}%</td>
                      <td className="px-4 py-2.5 text-muted">{h.reading_time} min</td>
                      <td className="px-4 py-2.5 text-muted">{formatDate(h.last_accessed)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
