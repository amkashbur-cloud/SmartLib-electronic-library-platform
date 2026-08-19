import Link from "next/link";
import { BookIcon } from "./Icons";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-white">
              <BookIcon className="h-4 w-4" />
            </span>
            SmartLib
          </div>
          <p className="mt-2 text-sm text-muted">Search. Learn. Discover.</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Explore</p>
          <ul className="mt-2 space-y-1.5 text-sm text-muted">
            <li><Link href="/library" className="hover:text-brand">Library</Link></li>
            <li><Link href="/library?featured=1" className="hover:text-brand">Featured resources</Link></li>
            <li><Link href="/recommendations" className="hover:text-brand">Recommendations</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Account</p>
          <ul className="mt-2 space-y-1.5 text-sm text-muted">
            <li><Link href="/login" className="hover:text-brand">Sign in</Link></li>
            <li><Link href="/register" className="hover:text-brand">Create account</Link></li>
            <li><Link href="/my-library" className="hover:text-brand">My Library</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">About this demo</p>
          <p className="mt-2 text-sm text-muted">
            All catalog content is fictional or open-access demo data. No copyrighted works are included.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} SmartLib — a training project.
      </div>
    </footer>
  );
}
