import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

const TABS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/resources", label: "Resources" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/reports", label: "Reports" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-foreground">Admin</h1>
      <nav className="mt-4 flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <Link key={t.href} href={t.href} className="rounded-t-lg px-4 py-2 text-sm font-medium text-muted hover:text-brand">
            {t.label}
          </Link>
        ))}
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  );
}
