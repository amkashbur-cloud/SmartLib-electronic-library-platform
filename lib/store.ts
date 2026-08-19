import { hashPassword } from "./auth";
import { createRng, intBetween, pick, pickMany } from "./prng";
import { AUTHOR_SEED, CATEGORY_SEED, RESOURCE_SEED } from "./seed-data";
import type {
  Author,
  Category,
  DownloadEvent,
  Favorite,
  ReadingHistoryEntry,
  ReadingList,
  ReadingListItem,
  Resource,
  Review,
  Role,
  User,
} from "./types";

interface Database {
  users: User[];
  authors: Author[];
  categories: Category[];
  resources: Resource[];
  favorites: Favorite[];
  readingHistory: ReadingHistoryEntry[];
  readingLists: ReadingList[];
  readingListItems: ReadingListItem[];
  reviews: Review[];
  downloads: DownloadEvent[];
  counters: Record<string, number>;
}

declare global {
  var __smartlibDb: Database | undefined;
}

const COVER_COLORS = ["#2563eb", "#0ea5e9", "#4f46e5", "#0891b2", "#059669", "#7c3aed", "#dc2626", "#d97706"];

function nextId(db: Database, prefix: string): string {
  db.counters[prefix] = (db.counters[prefix] ?? 0) + 1;
  return `${prefix}_${db.counters[prefix]}`;
}

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

const DEMO_USER_SEED: { full_name: string; email: string; role: Role }[] = [
  { full_name: "Sara Ahmed", email: "sara.student@smartlib.edu", role: "student" },
  { full_name: "Karim Nasser", email: "karim.student@smartlib.edu", role: "student" },
  { full_name: "Lina Youssef", email: "lina.student@smartlib.edu", role: "student" },
  { full_name: "Tarek Selim", email: "tarek.student@smartlib.edu", role: "student" },
  { full_name: "Mona Rachid", email: "mona.researcher@smartlib.edu", role: "researcher" },
  { full_name: "Adam Fischer", email: "adam.researcher@smartlib.edu", role: "researcher" },
  { full_name: "Huda Kassem", email: "huda.researcher@smartlib.edu", role: "researcher" },
  { full_name: "Nabil Otman", email: "nabil.student@smartlib.edu", role: "student" },
  { full_name: "Admin User", email: "admin@smartlib.edu", role: "admin" },
  { full_name: "Yasmine Idris", email: "yasmine.admin@smartlib.edu", role: "admin" },
];

const REVIEW_COMMENTS = [
  "Very clear explanations, helped me a lot with my coursework.",
  "Solid overview but could use more recent examples.",
  "Exactly what I needed for my research project.",
  "Well organized and easy to follow.",
  "A bit dense in places, but the content is accurate and useful.",
  "Great reference material, I keep coming back to it.",
  "Good introduction for beginners in the field.",
  "Comprehensive coverage of the core concepts.",
  "Helped me understand a topic I was struggling with.",
  "Would recommend to anyone studying this subject.",
];

function seed(): Database {
  const rng = createRng(42);
  const db: Database = {
    users: [],
    authors: [],
    categories: [],
    resources: [],
    favorites: [],
    readingHistory: [],
    readingLists: [],
    readingListItems: [],
    reviews: [],
    downloads: [],
    counters: {},
  };

  // Users (password for every demo account: "Password123")
  const demoHash = hashPassword("Password123");
  for (const u of DEMO_USER_SEED) {
    db.users.push({
      id: nextId(db, "u"),
      full_name: u.full_name,
      email: u.email,
      password_hash: demoHash,
      role: u.role,
      account_status: "active",
      created_at: daysAgoIso(intBetween(rng, 30, 400)),
    });
  }

  // Authors
  for (const a of AUTHOR_SEED) {
    db.authors.push({ id: nextId(db, "a"), name: a.name, biography: a.biography });
  }

  // Categories
  for (const c of CATEGORY_SEED) {
    db.categories.push({ id: nextId(db, "c"), name: c.name, description: c.description });
  }

  // Resources
  for (const r of RESOURCE_SEED) {
    db.resources.push({
      id: nextId(db, "r"),
      title: r.title,
      description: r.description,
      resource_type: r.resource_type,
      author_id: db.authors[r.author].id,
      category_id: db.categories[r.category].id,
      isbn: `978-${intBetween(rng, 1, 9)}-${intBetween(rng, 100, 999)}-${intBetween(rng, 10000, 99999)}-${intBetween(rng, 0, 9)}`,
      publication_year: r.publication_year,
      language: r.language,
      cover_color: pick(rng, COVER_COLORS),
      file_url: "/demo-document",
      access_type: r.access_type,
      featured: r.featured ?? false,
      created_at: daysAgoIso(intBetween(rng, 5, 300)),
    });
  }

  const nonAdminUsers = db.users.filter((u) => u.role !== "admin");

  // Reading history: ~30 records spread across users/resources
  for (let i = 0; i < 30; i++) {
    const user = pick(rng, nonAdminUsers);
    const resource = pick(rng, db.resources);
    const progress = intBetween(rng, 5, 100);
    db.readingHistory.push({
      id: nextId(db, "rh"),
      user_id: user.id,
      resource_id: resource.id,
      progress,
      last_page: intBetween(rng, 1, 250),
      reading_time: intBetween(rng, 5, 240),
      last_accessed: daysAgoIso(intBetween(rng, 0, 180)),
    });
  }

  // Favorites: a handful per user
  for (const user of nonAdminUsers) {
    const favResources = pickMany(rng, db.resources, intBetween(rng, 1, 5));
    for (const resource of favResources) {
      db.favorites.push({
        id: nextId(db, "fav"),
        user_id: user.id,
        resource_id: resource.id,
        created_at: daysAgoIso(intBetween(rng, 0, 150)),
      });
    }
  }

  // Reviews: 20 total
  for (let i = 0; i < 20; i++) {
    const user = pick(rng, nonAdminUsers);
    const resource = pick(rng, db.resources);
    const already = db.reviews.find((r) => r.user_id === user.id && r.resource_id === resource.id);
    if (already) continue;
    db.reviews.push({
      id: nextId(db, "rev"),
      user_id: user.id,
      resource_id: resource.id,
      rating: intBetween(rng, 3, 5),
      comment: pick(rng, REVIEW_COMMENTS),
      created_at: daysAgoIso(intBetween(rng, 0, 200)),
    });
  }

  // Reading lists: one or two per user
  for (const user of nonAdminUsers.slice(0, 6)) {
    const list: ReadingList = {
      id: nextId(db, "rl"),
      user_id: user.id,
      name: "My Reading List",
      description: "Resources I plan to read soon.",
      created_at: daysAgoIso(intBetween(rng, 0, 100)),
    };
    db.readingLists.push(list);
    const items = pickMany(rng, db.resources, intBetween(rng, 2, 4));
    for (const resource of items) {
      db.readingListItems.push({
        id: nextId(db, "rli"),
        reading_list_id: list.id,
        resource_id: resource.id,
        added_at: daysAgoIso(intBetween(rng, 0, 90)),
      });
    }
  }

  // Downloads: derive a modest number of events from reading history
  for (const rh of db.readingHistory) {
    if (rh.progress > 40) {
      db.downloads.push({
        id: nextId(db, "dl"),
        user_id: rh.user_id,
        resource_id: rh.resource_id,
        created_at: rh.last_accessed,
      });
    }
  }

  return db;
}

export function getDb(): Database {
  if (!globalThis.__smartlibDb) {
    globalThis.__smartlibDb = seed();
  }
  return globalThis.__smartlibDb;
}

// ---------- Users ----------
export function findUserByEmail(email: string): User | undefined {
  return getDb().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  return getDb().users.find((u) => u.id === id);
}

export function createUser(input: { full_name: string; email: string; password_hash: string; role: Role }): User {
  const db = getDb();
  const user: User = {
    id: nextId(db, "u"),
    full_name: input.full_name,
    email: input.email,
    password_hash: input.password_hash,
    role: input.role,
    account_status: "active",
    created_at: new Date().toISOString(),
  };
  db.users.push(user);
  return user;
}

export function listUsers(): User[] {
  return getDb().users;
}

export function updateUser(id: string, patch: Partial<Pick<User, "role" | "account_status" | "full_name">>): User | undefined {
  const user = findUserById(id);
  if (!user) return undefined;
  Object.assign(user, patch);
  return user;
}

// ---------- Authors & Categories ----------
export function listAuthors(): Author[] {
  return getDb().authors;
}

export function findAuthorById(id: string): Author | undefined {
  return getDb().authors.find((a) => a.id === id);
}

export function createAuthor(input: { name: string; biography: string }): Author {
  const db = getDb();
  const author: Author = { id: nextId(db, "a"), name: input.name, biography: input.biography };
  db.authors.push(author);
  return author;
}

export function listCategories(): Category[] {
  return getDb().categories;
}

export function findCategoryById(id: string): Category | undefined {
  return getDb().categories.find((c) => c.id === id);
}

export function createCategory(input: { name: string; description: string }): Category {
  const db = getDb();
  const category: Category = { id: nextId(db, "c"), name: input.name, description: input.description };
  db.categories.push(category);
  return category;
}

// ---------- Resources ----------
export interface ResourceFilters {
  q?: string;
  category_id?: string;
  resource_type?: string;
  author_id?: string;
  publication_year?: number;
  language?: string;
  access_type?: string;
  featured?: boolean;
  sort?: "newest" | "oldest" | "title" | "rating" | "popular";
  page?: number;
  pageSize?: number;
}

export function listResources(filters: ResourceFilters = {}): { items: Resource[]; total: number } {
  let items = [...getDb().resources];

  if (filters.q) {
    const q = filters.q.toLowerCase();
    items = items.filter((r) => {
      const author = findAuthorById(r.author_id);
      const category = findCategoryById(r.category_id);
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.isbn.toLowerCase().includes(q) ||
        String(r.publication_year).includes(q) ||
        (author && author.name.toLowerCase().includes(q)) ||
        (category && category.name.toLowerCase().includes(q)) ||
        r.resource_type.toLowerCase().includes(q)
      );
    });
  }
  if (filters.category_id) items = items.filter((r) => r.category_id === filters.category_id);
  if (filters.resource_type) items = items.filter((r) => r.resource_type === filters.resource_type);
  if (filters.author_id) items = items.filter((r) => r.author_id === filters.author_id);
  if (filters.publication_year) items = items.filter((r) => r.publication_year === filters.publication_year);
  if (filters.language) items = items.filter((r) => r.language === filters.language);
  if (filters.access_type) items = items.filter((r) => r.access_type === filters.access_type);
  if (filters.featured) items = items.filter((r) => r.featured);

  const sort = filters.sort ?? "newest";
  if (sort === "newest") items.sort((a, b) => b.created_at.localeCompare(a.created_at));
  if (sort === "oldest") items.sort((a, b) => a.created_at.localeCompare(b.created_at));
  if (sort === "title") items.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "rating") items.sort((a, b) => averageRating(b.id) - averageRating(a.id));
  if (sort === "popular") items.sort((a, b) => popularityScore(b.id) - popularityScore(a.id));

  const total = items.length;
  const page = filters.page ?? 1;
  const pageSize = Math.min(filters.pageSize ?? 12, 100);
  const start = (page - 1) * pageSize;
  items = items.slice(start, start + pageSize);

  return { items, total };
}

export function findResourceById(id: string): Resource | undefined {
  return getDb().resources.find((r) => r.id === id);
}

export function createResource(input: Omit<Resource, "id" | "created_at">): Resource {
  const db = getDb();
  const resource: Resource = { ...input, id: nextId(db, "r"), created_at: new Date().toISOString() };
  db.resources.push(resource);
  return resource;
}

export function updateResource(id: string, patch: Partial<Omit<Resource, "id" | "created_at">>): Resource | undefined {
  const resource = findResourceById(id);
  if (!resource) return undefined;
  Object.assign(resource, patch);
  return resource;
}

export function deleteResource(id: string): boolean {
  const db = getDb();
  const idx = db.resources.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  db.resources.splice(idx, 1);
  return true;
}

// ---------- Favorites ----------
export function listFavoritesByUser(userId: string): Favorite[] {
  return getDb().favorites.filter((f) => f.user_id === userId);
}

export function isFavorite(userId: string, resourceId: string): boolean {
  return getDb().favorites.some((f) => f.user_id === userId && f.resource_id === resourceId);
}

export function toggleFavorite(userId: string, resourceId: string): boolean {
  const db = getDb();
  const idx = db.favorites.findIndex((f) => f.user_id === userId && f.resource_id === resourceId);
  if (idx >= 0) {
    db.favorites.splice(idx, 1);
    return false;
  }
  db.favorites.push({ id: nextId(db, "fav"), user_id: userId, resource_id: resourceId, created_at: new Date().toISOString() });
  return true;
}

export function favoriteCount(resourceId: string): number {
  return getDb().favorites.filter((f) => f.resource_id === resourceId).length;
}

// ---------- Reading history ----------
export function listReadingHistoryByUser(userId: string): ReadingHistoryEntry[] {
  return getDb().readingHistory
    .filter((r) => r.user_id === userId)
    .sort((a, b) => b.last_accessed.localeCompare(a.last_accessed));
}

export function getReadingProgress(userId: string, resourceId: string): ReadingHistoryEntry | undefined {
  return getDb().readingHistory.find((r) => r.user_id === userId && r.resource_id === resourceId);
}

export function upsertReadingProgress(
  userId: string,
  resourceId: string,
  patch: Partial<Pick<ReadingHistoryEntry, "progress" | "last_page" | "reading_time">>
): ReadingHistoryEntry {
  const db = getDb();
  let entry = db.readingHistory.find((r) => r.user_id === userId && r.resource_id === resourceId);
  if (!entry) {
    entry = {
      id: nextId(db, "rh"),
      user_id: userId,
      resource_id: resourceId,
      progress: 0,
      last_page: 1,
      reading_time: 0,
      last_accessed: new Date().toISOString(),
    };
    db.readingHistory.push(entry);
  }
  if (patch.progress !== undefined) entry.progress = patch.progress;
  if (patch.last_page !== undefined) entry.last_page = patch.last_page;
  if (patch.reading_time !== undefined) entry.reading_time += patch.reading_time;
  entry.last_accessed = new Date().toISOString();
  return entry;
}

export function readCount(resourceId: string): number {
  return getDb().readingHistory.filter((r) => r.resource_id === resourceId).length;
}

// ---------- Reading lists ----------
export function listReadingListsByUser(userId: string): ReadingList[] {
  return getDb().readingLists.filter((l) => l.user_id === userId);
}

export function findReadingListById(id: string): ReadingList | undefined {
  return getDb().readingLists.find((l) => l.id === id);
}

export function createReadingList(userId: string, name: string, description: string): ReadingList {
  const db = getDb();
  const list: ReadingList = { id: nextId(db, "rl"), user_id: userId, name, description, created_at: new Date().toISOString() };
  db.readingLists.push(list);
  return list;
}

export function deleteReadingList(id: string): boolean {
  const db = getDb();
  const idx = db.readingLists.findIndex((l) => l.id === id);
  if (idx === -1) return false;
  db.readingLists.splice(idx, 1);
  db.readingListItems = db.readingListItems.filter((i) => i.reading_list_id !== id);
  return true;
}

export function listReadingListItems(listId: string): ReadingListItem[] {
  return getDb().readingListItems.filter((i) => i.reading_list_id === listId);
}

export function addReadingListItem(listId: string, resourceId: string): ReadingListItem {
  const db = getDb();
  const item: ReadingListItem = { id: nextId(db, "rli"), reading_list_id: listId, resource_id: resourceId, added_at: new Date().toISOString() };
  db.readingListItems.push(item);
  return item;
}

export function removeReadingListItem(listId: string, resourceId: string): boolean {
  const db = getDb();
  const idx = db.readingListItems.findIndex((i) => i.reading_list_id === listId && i.resource_id === resourceId);
  if (idx === -1) return false;
  db.readingListItems.splice(idx, 1);
  return true;
}

// ---------- Reviews ----------
export function listReviewsByResource(resourceId: string): Review[] {
  return getDb().reviews.filter((r) => r.resource_id === resourceId).sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function listReviewsByUser(userId: string): Review[] {
  return getDb().reviews.filter((r) => r.user_id === userId);
}

export function findReviewByUserAndResource(userId: string, resourceId: string): Review | undefined {
  return getDb().reviews.find((r) => r.user_id === userId && r.resource_id === resourceId);
}

export function createReview(input: { user_id: string; resource_id: string; rating: number; comment: string }): Review {
  const db = getDb();
  const review: Review = { ...input, id: nextId(db, "rev"), created_at: new Date().toISOString() };
  db.reviews.push(review);
  return review;
}

export function deleteReview(id: string): boolean {
  const db = getDb();
  const idx = db.reviews.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  db.reviews.splice(idx, 1);
  return true;
}

export function averageRating(resourceId: string): number {
  const reviews = listReviewsByResource(resourceId);
  if (reviews.length === 0) return 0;
  return Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10;
}

// ---------- Downloads ----------
export function logDownload(userId: string, resourceId: string): DownloadEvent {
  const db = getDb();
  const event: DownloadEvent = { id: nextId(db, "dl"), user_id: userId, resource_id: resourceId, created_at: new Date().toISOString() };
  db.downloads.push(event);
  return event;
}

export function downloadCount(resourceId: string): number {
  return getDb().downloads.filter((d) => d.resource_id === resourceId).length;
}

// ---------- Aggregate helpers ----------
export function popularityScore(resourceId: string): number {
  return readCount(resourceId) * 2 + favoriteCount(resourceId) * 3 + downloadCount(resourceId) + averageRating(resourceId) * 5;
}

export function recentlyViewedByUser(userId: string, limit = 6): Resource[] {
  const history = listReadingHistoryByUser(userId);
  const seen = new Set<string>();
  const out: Resource[] = [];
  for (const h of history) {
    if (seen.has(h.resource_id)) continue;
    const resource = findResourceById(h.resource_id);
    if (resource) {
      out.push(resource);
      seen.add(h.resource_id);
    }
    if (out.length >= limit) break;
  }
  return out;
}
