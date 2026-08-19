import { getDb, popularityScore } from "./store";

export function totals() {
  const db = getDb();
  const ratings = db.reviews.map((r) => r.rating);
  return {
    totalResources: db.resources.length,
    totalUsers: db.users.length,
    totalReads: db.readingHistory.length,
    totalDownloads: db.downloads.length,
    monthlyActiveUsers: monthlyActiveUserCount(),
    averageRating: ratings.length ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : 0,
  };
}

function monthKey(iso: string) {
  return iso.slice(0, 7); // YYYY-MM
}

function lastNMonthKeys(n: number): string[] {
  const keys: string[] = [];
  const d = new Date();
  d.setDate(1);
  for (let i = n - 1; i >= 0; i--) {
    const m = new Date(d);
    m.setMonth(m.getMonth() - i);
    keys.push(m.toISOString().slice(0, 7));
  }
  return keys;
}

function monthlyActiveUserCount(): number {
  const db = getDb();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const active = new Set<string>();
  for (const h of db.readingHistory) {
    if (monthKey(h.last_accessed) === currentMonth) active.add(h.user_id);
  }
  return active.size;
}

export function monthlyReadingActivity(months = 6) {
  const db = getDb();
  const keys = lastNMonthKeys(months);
  const counts = new Map(keys.map((k) => [k, 0]));
  for (const h of db.readingHistory) {
    const key = monthKey(h.last_accessed);
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return keys.map((key) => ({ month: key, count: counts.get(key) ?? 0 }));
}

export function monthlyDownloads(months = 6) {
  const db = getDb();
  const keys = lastNMonthKeys(months);
  const counts = new Map(keys.map((k) => [k, 0]));
  for (const d of db.downloads) {
    const key = monthKey(d.created_at);
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return keys.map((key) => ({ month: key, count: counts.get(key) ?? 0 }));
}

export function resourcesByCategory() {
  const db = getDb();
  return db.categories
    .map((c) => ({ name: c.name, count: db.resources.filter((r) => r.category_id === c.id).length }))
    .sort((a, b) => b.count - a.count);
}

export function resourceTypeDistribution() {
  const db = getDb();
  const counts = new Map<string, number>();
  for (const r of db.resources) counts.set(r.resource_type, (counts.get(r.resource_type) ?? 0) + 1);
  return [...counts.entries()].map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);
}

export function topResources(limit = 10) {
  const db = getDb();
  return [...db.resources]
    .sort((a, b) => popularityScore(b.id) - popularityScore(a.id))
    .slice(0, limit)
    .map((r) => ({ resource: r, score: popularityScore(r.id) }));
}

export function mostActiveUsers(limit = 10) {
  const db = getDb();
  const activity = new Map<string, number>();
  for (const h of db.readingHistory) activity.set(h.user_id, (activity.get(h.user_id) ?? 0) + 1);
  for (const f of db.favorites) activity.set(f.user_id, (activity.get(f.user_id) ?? 0) + 1);
  for (const r of db.reviews) activity.set(r.user_id, (activity.get(r.user_id) ?? 0) + 1);
  return [...activity.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([userId, score]) => ({ user: db.users.find((u) => u.id === userId), score }))
    .filter((x): x is { user: NonNullable<typeof x.user>; score: number } => Boolean(x.user));
}

export function recentActivity(limit = 15) {
  const db = getDb();
  type Item = { type: string; label: string; at: string };
  const items: Item[] = [];
  for (const h of db.readingHistory) {
    const r = db.resources.find((x) => x.id === h.resource_id);
    const u = db.users.find((x) => x.id === h.user_id);
    if (r && u) items.push({ type: "read", label: `${u.full_name} read "${r.title}"`, at: h.last_accessed });
  }
  for (const r of db.reviews) {
    const res = db.resources.find((x) => x.id === r.resource_id);
    const u = db.users.find((x) => x.id === r.user_id);
    if (res && u) items.push({ type: "review", label: `${u.full_name} reviewed "${res.title}"`, at: r.created_at });
  }
  for (const u of db.users) {
    items.push({ type: "signup", label: `${u.full_name} joined SmartLib`, at: u.created_at });
  }
  return items.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}
