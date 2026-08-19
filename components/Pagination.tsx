import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

export function Pagination({
  page,
  pageSize,
  total,
  basePath,
  searchParams,
}: {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  function hrefFor(p: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value);
    }
    params.set("page", String(p));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={`flex h-9 w-9 items-center justify-center rounded-lg border border-border ${page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-slate-50"}`}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Link>
      <span className="px-3 text-sm text-muted">
        Page {page} of {totalPages}
      </span>
      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={`flex h-9 w-9 items-center justify-center rounded-lg border border-border ${page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-slate-50"}`}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Link>
    </nav>
  );
}
