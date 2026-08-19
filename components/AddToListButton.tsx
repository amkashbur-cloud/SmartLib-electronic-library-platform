"use client";

import { useEffect, useState } from "react";
import { Button, Select } from "./ui";
import { PlusIcon } from "./Icons";
import type { ReadingList } from "@/lib/types";

export function AddToListButton({ resourceId, signedIn }: { resourceId: string; signedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState<ReadingList[]>([]);
  const [selected, setSelected] = useState("");
  const [newName, setNewName] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (open && signedIn) {
      fetch("/api/reading-lists")
        .then((r) => r.json())
        .then((data) => setLists(data.items ?? []));
    }
  }, [open, signedIn]);

  async function addToList(listId: string) {
    const res = await fetch(`/api/reading-lists/${listId}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource_id: resourceId }),
    });
    const data = await res.json();
    setStatus(res.ok ? "Added to your reading list." : data.message ?? "Could not add resource.");
  }

  async function createAndAdd() {
    if (!newName.trim()) return;
    const res = await fetch("/api/reading-lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      await addToList(data.list.id);
      setNewName("");
      setLists((prev) => [...prev, data.list]);
    } else {
      setStatus(data.message ?? "Could not create list.");
    }
  }

  if (!signedIn) return null;

  return (
    <div className="relative">
      <Button variant="secondary" size="sm" onClick={() => setOpen((v) => !v)}>
        <PlusIcon className="h-4 w-4" /> Add to reading list
      </Button>
      {open && (
        <div className="absolute z-20 mt-2 w-64 rounded-lg border border-border bg-white p-3 shadow-lg">
          {lists.length > 0 && (
            <div className="mb-3">
              <Select value={selected} onChange={(e) => setSelected(e.target.value)}>
                <option value="">Choose a list…</option>
                {lists.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </Select>
              <Button size="sm" className="mt-2 w-full" disabled={!selected} onClick={() => selected && addToList(selected)}>
                Add
              </Button>
            </div>
          )}
          <div className="border-t border-border pt-3">
            <p className="mb-1.5 text-xs font-medium text-muted">New list</p>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Semester reading"
              className="w-full rounded-lg border border-border px-2 py-1.5 text-sm"
            />
            <Button size="sm" className="mt-2 w-full" onClick={createAndAdd}>
              Create &amp; add
            </Button>
          </div>
          {status && <p className="mt-2 text-xs text-muted">{status}</p>}
        </div>
      )}
    </div>
  );
}
