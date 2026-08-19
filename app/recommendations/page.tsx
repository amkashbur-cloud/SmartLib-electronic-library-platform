import Link from "next/link";
import { ResourceCard } from "@/components/ResourceCard";
import { EmptyState } from "@/components/ui";
import { getCurrentUser } from "@/lib/session";
import { enrichResources } from "@/lib/resource-view";
import { listResources, recentlyViewedByUser } from "@/lib/store";
import { popularInField, recommendForUser, relatedToRecentlyViewed } from "@/lib/recommendations";

export default async function RecommendationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    const popular = enrichResources(listResources({ sort: "popular", pageSize: 8 }).items);
    return (
      <div className="container-page py-8">
        <h1 className="text-2xl font-bold text-foreground">Recommendations</h1>
        <p className="mt-1 text-sm text-muted">
          <Link href="/login" className="font-medium text-brand hover:underline">Sign in</Link> to get recommendations based on your
          reading history and favorites. Meanwhile, here&apos;s what&apos;s popular across SmartLib.
        </p>
        <div className="mt-6">
          <Grid items={popular} />
        </div>
      </div>
    );
  }

  const forYou = enrichResources(recommendForUser(user.id, 8));
  const related = enrichResources(relatedToRecentlyViewed(user.id, 6));
  const field = enrichResources(popularInField(user.id, 6));
  const recentlyViewed = enrichResources(recentlyViewedByUser(user.id, 6));

  return (
    <div className="container-page py-8 space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Recommendations</h1>
        <p className="mt-1 text-sm text-muted">Curated from your favorites, reading history, and academic field.</p>
      </div>

      <Section title="Recommended for You">
        {forYou.length === 0 ? (
          <EmptyState title="Not enough activity yet" description="Favorite a few resources or start reading to get tailored picks." />
        ) : (
          <Grid items={forYou} />
        )}
      </Section>

      <Section title="Based on Your Reading History">
        {related.length === 0 ? (
          <EmptyState title="No reading history yet" description="Read a resource in the library and related picks will show up here." />
        ) : (
          <Grid items={related} />
        )}
      </Section>

      <Section title="Popular in Your Field">
        <Grid items={field} />
      </Section>

      <Section title="Recently Viewed">
        {recentlyViewed.length === 0 ? (
          <EmptyState title="Nothing viewed yet" description="Resources you open will appear here for quick access." />
        ) : (
          <Grid items={recentlyViewed} />
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Grid({ items }: { items: ReturnType<typeof enrichResources> }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map(({ resource, author, category, rating, reviewCount }) => (
        <ResourceCard key={resource.id} resource={resource} author={author} category={category} rating={rating} reviewCount={reviewCount} />
      ))}
    </div>
  );
}
