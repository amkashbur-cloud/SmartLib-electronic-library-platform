import Link from "next/link";
import { SearchIcon, SparklesIcon } from "@/components/Icons";
import { ResourceCard } from "@/components/ResourceCard";
import { Button } from "@/components/ui";
import { getCurrentUser } from "@/lib/session";
import { listCategories, listResources, listUsers } from "@/lib/store";
import { enrichResources } from "@/lib/resource-view";
import { recommendForUser } from "@/lib/recommendations";

export default async function HomePage() {
  const user = await getCurrentUser();

  const featured = enrichResources(listResources({ featured: true, pageSize: 4 }).items);
  const popular = enrichResources(listResources({ sort: "popular", pageSize: 4 }).items);
  const newArrivals = enrichResources(listResources({ sort: "newest", pageSize: 4 }).items);
  const categories = listCategories();
  const { total: totalResources } = listResources({ pageSize: 1 });
  const totalUsers = listUsers().length;

  const recommended = user ? enrichResources(recommendForUser(user.id, 4)) : [];

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-brand-light to-background">
        <div className="container-page py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Search. Learn. Discover.
            </h1>
            <p className="mt-4 text-base text-muted sm:text-lg">
              SmartLib brings e-books, research papers, theses, and course material into one
              place for students, researchers, and academics.
            </p>
            <form action="/library" className="mx-auto mt-8 flex max-w-lg items-center gap-2">
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  name="q"
                  placeholder="Search by title, author, subject, or ISBN…"
                  className="w-full rounded-lg border border-border bg-white py-3 pl-9 pr-3 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
            {!user && (
              <p className="mt-4 text-sm text-muted">
                <Link href="/register" className="font-medium text-brand hover:underline">Create a free account</Link> to save
                favorites, build reading lists, and get recommendations.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="container-page grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
        {[
          { label: "Academic resources", value: totalResources },
          { label: "Registered users", value: totalUsers },
          { label: "Categories", value: categories.length },
          { label: "Resource types", value: 6 },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface p-5 text-center shadow-sm">
            <p className="text-2xl font-bold text-brand">{s.value}</p>
            <p className="mt-1 text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </section>

      {recommended.length > 0 && (
        <Section title="Recommended for You" icon={<SparklesIcon className="h-5 w-5 text-brand" />} href="/recommendations">
          <ResourceGrid items={recommended} />
        </Section>
      )}

      <Section title="Featured Books" href="/library?featured=1">
        <ResourceGrid items={featured} />
      </Section>

      <Section title="Popular Resources" href="/library?sort=popular">
        <ResourceGrid items={popular} />
      </Section>

      <Section title="New Arrivals" href="/library?sort=newest">
        <ResourceGrid items={newArrivals} />
      </Section>

      <section className="container-page py-10">
        <h2 className="text-lg font-semibold text-foreground">Academic Categories</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/library?category_id=${c.id}`}
              className="rounded-lg border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground shadow-sm hover:border-brand hover:text-brand"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Section({ title, href, icon, children }: { title: string; href: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="container-page py-8">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          {icon}
          {title}
        </h2>
        <Link href={href} className="text-sm font-medium text-brand hover:underline">
          View all
        </Link>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ResourceGrid({ items }: { items: ReturnType<typeof enrichResources> }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted">Nothing to show yet.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map(({ resource, author, category, rating, reviewCount }) => (
        <ResourceCard key={resource.id} resource={resource} author={author} category={category} rating={rating} reviewCount={reviewCount} />
      ))}
    </div>
  );
}
