"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Button, Input, Select } from "./ui";
import { SearchIcon } from "./Icons";
import type { Author, Category } from "@/lib/types";

const RESOURCE_TYPES = ["E-Book", "Research Paper", "Thesis", "Journal Article", "Lecture Material", "Educational Resource"];
const LANGUAGES = ["English", "Arabic"];
const ACCESS_TYPES = ["Open Access", "Licensed", "Restricted", "Demo"];

export function LibraryFilters({
  categories,
  authors,
  years,
  current,
}: {
  categories: Category[];
  authors: Author[];
  years: number[];
  current: Record<string, string | undefined>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function submitNow() {
    formRef.current?.requestSubmit();
  }

  return (
    <form ref={formRef} action="/library" method="get" className="space-y-4 rounded-xl border border-border bg-surface p-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="q">Search</label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input id="q" name="q" defaultValue={current.q ?? ""} placeholder="Title, author, ISBN…" className="pl-9" />
        </div>
      </div>

      <FilterSelect name="category_id" label="Category" current={current.category_id} onSubmit={submitNow}>
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </FilterSelect>

      <FilterSelect name="resource_type" label="Resource type" current={current.resource_type} onSubmit={submitNow}>
        <option value="">All types</option>
        {RESOURCE_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </FilterSelect>

      <FilterSelect name="author_id" label="Author" current={current.author_id} onSubmit={submitNow}>
        <option value="">All authors</option>
        {authors.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </FilterSelect>

      <FilterSelect name="publication_year" label="Publication year" current={current.publication_year} onSubmit={submitNow}>
        <option value="">Any year</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </FilterSelect>

      <FilterSelect name="language" label="Language" current={current.language} onSubmit={submitNow}>
        <option value="">Any language</option>
        {LANGUAGES.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </FilterSelect>

      <FilterSelect name="access_type" label="Access type" current={current.access_type} onSubmit={submitNow}>
        <option value="">Any access type</option>
        {ACCESS_TYPES.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </FilterSelect>

      <FilterSelect name="sort" label="Sort by" current={current.sort ?? "newest"} onSubmit={submitNow}>
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="title">Title (A–Z)</option>
        <option value="rating">Highest rated</option>
        <option value="popular">Most popular</option>
      </FilterSelect>

      <div className="flex gap-2 pt-2">
        <Button type="submit" size="sm" className="flex-1">Apply filters</Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => router.push("/library")}>
          Clear
        </Button>
      </div>
    </form>
  );
}

function FilterSelect({
  name,
  label,
  current,
  onSubmit,
  children,
}: {
  name: string;
  label: string;
  current?: string;
  onSubmit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor={name}>{label}</label>
      <Select id={name} name={name} defaultValue={current ?? ""} onChange={onSubmit}>
        {children}
      </Select>
    </div>
  );
}
