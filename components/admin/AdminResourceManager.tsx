"use client";

import { useMemo, useState } from "react";
import { Badge, Button, FieldLabel, Input, Select, Textarea } from "@/components/ui";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EditIcon, PlusIcon, TrashIcon } from "@/components/Icons";
import type { AccessType, Author, Category, Language, Resource, ResourceType } from "@/lib/types";

const RESOURCE_TYPES: ResourceType[] = ["E-Book", "Research Paper", "Thesis", "Journal Article", "Lecture Material", "Educational Resource"];
const LANGUAGES: Language[] = ["English", "Arabic"];
const ACCESS_TYPES: AccessType[] = ["Open Access", "Licensed", "Restricted", "Demo"];

type FormState = {
  title: string;
  description: string;
  resource_type: ResourceType;
  author_id: string;
  category_id: string;
  isbn: string;
  publication_year: string;
  language: Language;
  access_type: AccessType;
  featured: boolean;
};

function emptyForm(authors: Author[], categories: Category[]): FormState {
  return {
    title: "",
    description: "",
    resource_type: "E-Book",
    author_id: authors[0]?.id ?? "",
    category_id: categories[0]?.id ?? "",
    isbn: "",
    publication_year: String(new Date().getFullYear()),
    language: "English",
    access_type: "Open Access",
    featured: false,
  };
}

export function AdminResourceManager({
  initialResources,
  authors,
  categories,
}: {
  initialResources: Resource[];
  authors: Author[];
  categories: Category[];
}) {
  const [resources, setResources] = useState(initialResources);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Resource | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm(authors, categories));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const authorName = (id: string) => authors.find((a) => a.id === id)?.name ?? "Unknown";
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "Uncategorized";

  const filtered = useMemo(
    () => resources.filter((r) => r.title.toLowerCase().includes(query.toLowerCase())),
    [resources, query]
  );

  function startCreate() {
    setForm(emptyForm(authors, categories));
    setEditing(null);
    setCreating(true);
    setError(null);
  }

  function startEdit(resource: Resource) {
    setForm({
      title: resource.title,
      description: resource.description,
      resource_type: resource.resource_type,
      author_id: resource.author_id,
      category_id: resource.category_id,
      isbn: resource.isbn,
      publication_year: String(resource.publication_year),
      language: resource.language,
      access_type: resource.access_type,
      featured: resource.featured,
    });
    setEditing(resource);
    setCreating(false);
    setError(null);
  }

  function closeForm() {
    setEditing(null);
    setCreating(false);
  }

  async function submitForm() {
    setBusy(true);
    setError(null);
    const payload = { ...form, publication_year: Number(form.publication_year) };
    const url = editing ? `/api/resources/${editing.id}` : "/api/resources";
    const method = editing ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.message ?? "Something went wrong.");
      return;
    }
    if (editing) {
      setResources((prev) => prev.map((r) => (r.id === editing.id ? data.resource : r)));
    } else {
      setResources((prev) => [data.resource, ...prev]);
    }
    closeForm();
  }

  async function toggleFeatured(resource: Resource) {
    const res = await fetch(`/api/resources/${resource.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !resource.featured }),
    });
    if (res.ok) {
      const data = await res.json();
      setResources((prev) => prev.map((r) => (r.id === resource.id ? data.resource : r)));
    }
  }

  async function remove(resource: Resource) {
    const res = await fetch(`/api/resources/${resource.id}`, { method: "DELETE" });
    if (res.ok) setResources((prev) => prev.filter((r) => r.id !== resource.id));
  }

  const formOpen = creating || editing !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search resources…" className="max-w-xs" />
        <Button onClick={startCreate}>
          <PlusIcon className="h-4 w-4" /> Add resource
        </Button>
      </div>

      {formOpen && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-semibold text-foreground">{editing ? "Edit resource" : "Add resource"}</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel>Title</FieldLabel>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={200} />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Description</FieldLabel>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={2000} />
            </div>
            <div>
              <FieldLabel>Author</FieldLabel>
              <Select value={form.author_id} onChange={(e) => setForm({ ...form, author_id: e.target.value })}>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <FieldLabel>Category</FieldLabel>
              <Select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <FieldLabel>Resource type</FieldLabel>
              <Select value={form.resource_type} onChange={(e) => setForm({ ...form, resource_type: e.target.value as ResourceType })}>
                {RESOURCE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </div>
            <div>
              <FieldLabel>Language</FieldLabel>
              <Select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value as Language })}>
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </Select>
            </div>
            <div>
              <FieldLabel>Access type</FieldLabel>
              <Select value={form.access_type} onChange={(e) => setForm({ ...form, access_type: e.target.value as AccessType })}>
                {ACCESS_TYPES.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </Select>
            </div>
            <div>
              <FieldLabel>Publication year</FieldLabel>
              <Input type="number" value={form.publication_year} onChange={(e) => setForm({ ...form, publication_year: e.target.value })} />
            </div>
            <div>
              <FieldLabel>ISBN</FieldLabel>
              <Input value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Featured
            </label>
          </div>
          {error && <p className="mt-2 text-xs text-danger">{error}</p>}
          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={submitForm} disabled={busy || !form.title || !form.description}>
              {busy ? "Saving…" : editing ? "Save changes" : "Create resource"}
            </Button>
            <Button size="sm" variant="secondary" onClick={closeForm}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs text-muted">
            <tr>
              <th className="px-4 py-2.5 font-medium">Title</th>
              <th className="px-4 py-2.5 font-medium">Author</th>
              <th className="px-4 py-2.5 font-medium">Category</th>
              <th className="px-4 py-2.5 font-medium">Access</th>
              <th className="px-4 py-2.5 font-medium">Featured</th>
              <th className="px-4 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="max-w-[220px] truncate px-4 py-2.5 font-medium text-foreground">{r.title}</td>
                <td className="px-4 py-2.5 text-muted">{authorName(r.author_id)}</td>
                <td className="px-4 py-2.5 text-muted">{categoryName(r.category_id)}</td>
                <td className="px-4 py-2.5"><Badge tone="neutral">{r.access_type}</Badge></td>
                <td className="px-4 py-2.5">
                  <button onClick={() => toggleFeatured(r)}>
                    <Badge tone={r.featured ? "brand" : "neutral"}>{r.featured ? "Featured" : "Not featured"}</Badge>
                  </button>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <button onClick={() => startEdit(r)} className="text-muted hover:text-brand" aria-label="Edit">
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <ConfirmDialog
                      trigger={
                        <button className="text-muted hover:text-danger" aria-label="Delete">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      }
                      title="Delete this resource?"
                      description={`"${r.title}" will be permanently removed from the catalog.`}
                      confirmLabel="Delete"
                      onConfirm={() => remove(r)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
