import Link from "next/link";
import { BarChart, HorizontalBars } from "@/components/BarChart";
import {
  mostActiveUsers,
  monthlyReadingActivity,
  recentActivity,
  resourcesByCategory,
  topResources,
  totals,
} from "@/lib/analytics";
import { formatDate } from "@/lib/format";

export default async function AdminDashboardPage() {
  const t = totals();
  const monthly = monthlyReadingActivity(6);
  const monthlyReads = monthly[monthly.length - 1]?.count ?? 0;
  const categories = resourcesByCategory();
  const top = topResources(5);
  const activeUsers = mostActiveUsers(5);
  const activity = recentActivity(10);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total resources" value={t.totalResources} />
        <StatCard label="Registered users" value={t.totalUsers} />
        <StatCard label="Monthly reads" value={monthlyReads} />
        <StatCard label="Downloads" value={t.totalDownloads} />
        <StatCard label="Monthly active users" value={t.monthlyActiveUsers} />
        <StatCard label="Avg. rating" value={t.averageRating || "—"} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold text-foreground">Monthly Reading Activity</h2>
          <div className="mt-4">
            <BarChart data={monthly.map((m) => ({ label: m.month.slice(5), value: m.count }))} />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold text-foreground">Resources by Category</h2>
          <div className="mt-4">
            <HorizontalBars data={categories.map((c) => ({ label: c.name, value: c.count }))} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold text-foreground">Most Popular Resources</h2>
          <ul className="mt-3 space-y-2">
            {top.map(({ resource, score }, i) => (
              <li key={resource.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="text-xs text-muted">{i + 1}.</span>
                  <Link href={`/resource/${resource.id}`} className="truncate text-foreground hover:text-brand">{resource.title}</Link>
                </span>
                <span className="shrink-0 text-xs text-muted">score {score}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold text-foreground">Most Active Users</h2>
          <ul className="mt-3 space-y-2">
            {activeUsers.map(({ user, score }, i) => (
              <li key={user.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="text-xs text-muted">{i + 1}.</span>
                  <span className="text-foreground">{user.full_name}</span>
                </span>
                <span className="text-xs text-muted">{score} actions</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {activity.map((a, i) => (
            <li key={i} className="flex items-center justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0">
              <span className="text-foreground">{a.label}</span>
              <span className="shrink-0 text-xs text-muted">{formatDate(a.at)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 text-center">
      <p className="text-xl font-bold text-brand">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}
