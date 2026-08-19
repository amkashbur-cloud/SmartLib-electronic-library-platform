import { redirect } from "next/navigation";
import { Badge } from "@/components/ui";
import { ProfileSettingsForm } from "@/components/ProfileSettingsForm";
import { getCurrentUser } from "@/lib/session";
import { toPublicUser } from "@/lib/types";
import { findCategoryById, findResourceById, listFavoritesByUser, listReadingHistoryByUser, listReviewsByUser } from "@/lib/store";
import { formatDate } from "@/lib/format";

const ROLE_LABEL: Record<string, string> = { student: "Student", researcher: "Researcher", admin: "Administrator" };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const history = listReadingHistoryByUser(user.id);
  const favorites = listFavoritesByUser(user.id);
  const reviews = listReviewsByUser(user.id);

  const distinctResourcesRead = new Set(history.map((h) => h.resource_id)).size;
  const totalReadingMinutes = history.reduce((sum, h) => sum + h.reading_time, 0);
  const avgRatingGiven = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  const categoryCounts = new Map<string, number>();
  for (const f of favorites) {
    const r = findResourceById(f.resource_id);
    if (r) categoryCounts.set(r.category_id, (categoryCounts.get(r.category_id) ?? 0) + 1);
  }
  for (const h of history) {
    const r = findResourceById(h.resource_id);
    if (r) categoryCounts.set(r.category_id, (categoryCounts.get(r.category_id) ?? 0) + 1);
  }
  const favoriteCategories = [...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => findCategoryById(id)?.name)
    .filter((n): n is string => Boolean(n));

  return (
    <div className="container-page max-w-3xl py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{user.full_name}</h1>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
        <Badge tone="brand">{ROLE_LABEL[user.role]}</Badge>
      </div>
      <p className="mt-1 text-xs text-muted">Member since {formatDate(user.created_at)}</p>

      <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Resources read", value: distinctResourcesRead },
          { label: "Reading minutes", value: totalReadingMinutes },
          { label: "Favorites", value: favorites.length },
          { label: "Avg. rating given", value: avgRatingGiven },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-xl font-bold text-brand">{s.value}</p>
            <p className="mt-1 text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="text-base font-semibold text-foreground">Favorite Categories</h2>
        {favoriteCategories.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Favorite or read a few resources to see your top categories.</p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {favoriteCategories.map((name) => (
              <Badge key={name} tone="neutral">{name}</Badge>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-base font-semibold text-foreground">Account Settings</h2>
        <div className="mt-3">
          <ProfileSettingsForm user={toPublicUser(user)} />
        </div>
      </section>
    </div>
  );
}
