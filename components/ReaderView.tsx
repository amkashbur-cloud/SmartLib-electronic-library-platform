"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BookmarkIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon, XIcon, ZoomInIcon, ZoomOutIcon } from "./Icons";
import { Button, Input } from "./ui";

const FONT_SIZES = ["text-sm", "text-base", "text-lg", "text-xl"];

export function ReaderView({
  resourceId,
  title,
  pages,
  initialPage,
}: {
  resourceId: string;
  title: string;
  pages: string[];
  initialPage: number;
}) {
  const [page, setPage] = useState(Math.min(Math.max(initialPage, 1), pages.length));
  const [zoomIndex, setZoomIndex] = useState(1);
  const [query, setQuery] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const startedAt = useRef(0);
  const lastSaved = useRef(initialPage);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const progress = Math.round((page / pages.length) * 100);

  async function saveProgress(nextPage: number) {
    const minutes = Math.max(0, Math.round((Date.now() - startedAt.current) / 60000));
    startedAt.current = Date.now();
    await fetch("/api/reading-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resource_id: resourceId,
        last_page: nextPage,
        progress: Math.round((nextPage / pages.length) * 100),
        reading_time: minutes,
      }),
    });
  }

  useEffect(() => {
    if (page !== lastSaved.current) {
      lastSaved.current = page;
      saveProgress(page);
      setBookmarked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function goTo(n: number) {
    setNotFound(false);
    setPage(Math.min(Math.max(n, 1), pages.length));
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const idx = pages.findIndex((p) => p.toLowerCase().includes(query.toLowerCase()));
    if (idx === -1) {
      setNotFound(true);
      return;
    }
    goTo(idx + 1);
  }

  async function handleBookmark() {
    await saveProgress(page);
    setBookmarked(true);
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-slate-50">
      <div className="sticky top-16 z-10 border-b border-border bg-white px-4 py-3">
        <div className="container-page flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link href={`/resource/${resourceId}`} className="flex items-center gap-1 text-sm font-medium text-muted hover:text-brand">
              <XIcon className="h-4 w-4" /> Exit
            </Link>
            <p className="truncate text-sm font-semibold text-foreground">{title}</p>
          </div>
          <form onSubmit={handleSearch} className="flex items-center gap-1.5">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search in document…"
                className="h-8 w-48 pl-8 text-xs"
              />
            </div>
          </form>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" onClick={() => setZoomIndex((z) => Math.max(0, z - 1))} aria-label="Zoom out">
              <ZoomOutIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setZoomIndex((z) => Math.min(FONT_SIZES.length - 1, z + 1))} aria-label="Zoom in">
              <ZoomInIcon className="h-4 w-4" />
            </Button>
            <Button variant={bookmarked ? "primary" : "ghost"} size="sm" onClick={handleBookmark}>
              <BookmarkIcon className="h-4 w-4" filled={bookmarked} /> Bookmark
            </Button>
          </div>
        </div>
        <div className="container-page mt-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted">Page {page} of {pages.length} · {progress}% complete</p>
        </div>
        {notFound && <p className="container-page mt-1 text-xs text-danger">No match found in this document.</p>}
      </div>

      <div className="container-page flex-1 py-8">
        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-white p-8 shadow-sm">
          <p className={`whitespace-pre-line leading-relaxed text-foreground ${FONT_SIZES[zoomIndex]}`}>{pages[page - 1]}</p>
        </div>

        <div className="mx-auto mt-6 flex max-w-2xl items-center justify-between">
          <Button variant="secondary" onClick={() => goTo(page - 1)} disabled={page <= 1}>
            <ChevronLeftIcon className="h-4 w-4" /> Previous
          </Button>
          <span className="text-sm text-muted">{page} / {pages.length}</span>
          <Button variant="secondary" onClick={() => goTo(page + 1)} disabled={page >= pages.length}>
            Next <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
