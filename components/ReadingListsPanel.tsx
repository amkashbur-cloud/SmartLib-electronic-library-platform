"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, EmptyState, Input } from "./ui";
import { ConfirmDialog } from "./ConfirmDialog";
import { TrashIcon } from "./Icons";
import type { ReadingList, ReadingListItem, Resource } from "@/lib/types";

type ListWithItems = ReadingList & { items: ReadingListItem[] };

export function ReadingListsPanel({ resourceLookup }: { resourceLookup: Record<string, Resource> }) {
  const [lists, setLists] = useState<ListWithItems[] | null>(null);
  const [name, setName] = useState("");

  async function refresh() {
    const res = await fetch("/api/reading-lists");
    const data = await res.json();
    setLists(data.items ?? []);
  }

  useEffect(() => {
    fetch("/api/reading-lists")
      .then((r) => r.json())
      .then((data) => setLists(data.items ?? []));
  }, []);

  async function createList() {
    if (!name.trim()) return;
    await fetch("/api/reading-lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    setName("");
    refresh();
  }

  async function deleteList(id: string) {
    await fetch(`/api/reading-lists/${id}`, { method: "DELETE" });
    refresh();
  }

  async function removeItem(listId: string, resourceId: string) {
    await fetch(`/api/reading-lists/${listId}/items/${resourceId}`, { method: "DELETE" });
    refresh();
  }

  if (lists === null) return <p className="text-sm text-muted">Loading your reading lists…</p>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="New reading list name…" />
        <Button onClick={createList}>Create</Button>
      </div>

      {lists.length === 0 ? (
        <EmptyState title="No reading lists yet" description="Create a list to organize resources for a course or research project." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {lists.map((list) => (
            <div key={list.id} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-foreground">{list.name}</p>
                <ConfirmDialog
                  trigger={
                    <button className="text-muted hover:text-danger" aria-label="Delete list">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  }
                  title="Delete this reading list?"
                  description={`"${list.name}" and its ${list.items.length} saved resource(s) will be removed. This can't be undone.`}
                  confirmLabel="Delete"
                  onConfirm={() => deleteList(list.id)}
                />
              </div>
              {list.items.length === 0 ? (
                <p className="mt-2 text-sm text-muted">No resources saved here yet.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {list.items.map((item) => {
                    const resource = resourceLookup[item.resource_id];
                    if (!resource) return null;
                    return (
                      <li key={item.id} className="flex items-center justify-between gap-2 text-sm">
                        <Link href={`/resource/${resource.id}`} className="truncate text-foreground hover:text-brand">
                          {resource.title}
                        </Link>
                        <button className="shrink-0 text-xs text-muted hover:text-danger" onClick={() => removeItem(list.id, resource.id)}>
                          Remove
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
