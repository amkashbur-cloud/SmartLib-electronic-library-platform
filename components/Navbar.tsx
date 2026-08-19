"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PublicUser } from "@/lib/types";
import { BookIcon, LogoutIcon, MenuIcon, SearchIcon, ShieldIcon, UserIcon, XIcon } from "./Icons";
import { Button, ButtonLink } from "./ui";

export function Navbar({ user }: { user: PublicUser | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const links = [
    { href: "/", label: "Home" },
    { href: "/library", label: "Library" },
    ...(user ? [{ href: "/recommendations", label: "Recommendations" }] : []),
    ...(user ? [{ href: "/my-library", label: "My Library" }] : []),
    ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
            <BookIcon className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">SmartLib</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-slate-100">
              {l.label}
            </Link>
          ))}
        </nav>

        <form action="/library" className="hidden max-w-sm flex-1 md:flex">
          <div className="relative w-full">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              name="q"
              placeholder="Search titles, authors, ISBN…"
              className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </form>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link href="/profile" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-slate-100">
                <UserIcon className="h-4 w-4" />
                {user.full_name.split(" ")[0]}
              </Link>
              {user.role === "admin" && (
                <span className="flex items-center gap-1 text-xs text-brand">
                  <ShieldIcon className="h-3.5 w-3.5" /> Admin
                </span>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogoutIcon className="h-4 w-4" /> Sign out
              </Button>
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" size="sm">
                Sign in
              </ButtonLink>
              <ButtonLink href="/register" size="sm">Create account</ButtonLink>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-surface px-4 pb-4 md:hidden">
          <form action="/library" className="my-3">
            <input name="q" placeholder="Search the library…" className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm" />
          </form>
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/profile" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100" onClick={() => setOpen(false)}>
                  Profile
                </Link>
                <button className="rounded-lg px-3 py-2 text-left text-sm font-medium text-danger hover:bg-slate-100" onClick={handleLogout}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
                <Link href="/register" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100" onClick={() => setOpen(false)}>
                  Create account
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
