import {
  favoriteCount,
  findResourceById,
  listFavoritesByUser,
  listReadingHistoryByUser,
  listResources,
  popularityScore,
  recentlyViewedByUser,
} from "./store";
import type { Resource } from "./types";

function topCategoriesForUser(userId: string): string[] {
  const counts = new Map<string, number>();
  for (const fav of listFavoritesByUser(userId)) {
    const r = findResourceById(fav.resource_id);
    if (r) counts.set(r.category_id, (counts.get(r.category_id) ?? 0) + 2);
  }
  for (const h of listReadingHistoryByUser(userId)) {
    const r = findResourceById(h.resource_id);
    if (r) counts.set(r.category_id, (counts.get(r.category_id) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([categoryId]) => categoryId);
}

function popularResources(exclude: Set<string>, limit: number): Resource[] {
  const { items } = listResources({ sort: "popular", pageSize: 100 });
  return items.filter((r) => !exclude.has(r.id)).slice(0, limit);
}

/** Rule-based MVP recommendation engine: favorite categories > recently-viewed neighbors > reading-history field > popularity fallback. */
export function recommendForUser(userId: string, limit = 8): Resource[] {
  const exclude = new Set<string>();
  for (const fav of listFavoritesByUser(userId)) exclude.add(fav.resource_id);

  const recommended: Resource[] = [];
  const topCategories = topCategoriesForUser(userId);

  for (const categoryId of topCategories) {
    if (recommended.length >= limit) break;
    const { items } = listResources({ category_id: categoryId, sort: "popular", pageSize: 20 });
    for (const r of items) {
      if (recommended.length >= limit) break;
      if (exclude.has(r.id) || recommended.some((x) => x.id === r.id)) continue;
      recommended.push(r);
    }
  }

  if (recommended.length < limit) {
    const alreadyExcluded = new Set([...exclude, ...recommended.map((r) => r.id)]);
    recommended.push(...popularResources(alreadyExcluded, limit - recommended.length));
  }

  return recommended.slice(0, limit);
}

export function relatedToRecentlyViewed(userId: string, limit = 6): Resource[] {
  const recent = recentlyViewedByUser(userId, 3);
  const exclude = new Set(recent.map((r) => r.id));
  const related: Resource[] = [];
  for (const r of recent) {
    const { items } = listResources({ category_id: r.category_id, sort: "popular", pageSize: 10 });
    for (const item of items) {
      if (related.length >= limit) break;
      if (exclude.has(item.id) || related.some((x) => x.id === item.id)) continue;
      related.push(item);
    }
  }
  return related;
}

export function popularInField(userId: string, limit = 6): Resource[] {
  const topCategories = topCategoriesForUser(userId);
  if (topCategories.length === 0) return popularResources(new Set(), limit);
  const { items } = listResources({ category_id: topCategories[0], sort: "popular", pageSize: limit });
  return items;
}

export { favoriteCount, popularityScore };
