import Link from "next/link";
import { BarChart, HorizontalBars } from "@/components/BarChart";
import {
  mostActiveUsers,
  monthlyDownloads,
  monthlyReadingActivity,
  resourceTypeDistribution,
  resourcesByCategory,
  topResources,
} from "@/lib/analytics";

export default async function AdminReportsPage() {
  const monthlyReads = monthlyReadingActivity(6);
  const downloads = monthlyDownloads(6);
  const categories = resourcesByCategory();
  const types = resourceTypeDistribution();
  const top = topResources(10);
  const activeUsers = mostActiveUsers(10);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ReportCard title="Reading Activity (last 6 months)">
          <BarChart data={monthlyReads.map((m) => ({ label: m.month.slice(5), value: m.count }))} />
        </ReportCard>
        <ReportCard title="Downloads (last 6 months)">
          <BarChart data={downloads.map((m) => ({ label: m.month.slice(5), value: m.count }))} />
        </ReportCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ReportCard title="Popular Categories">
          <HorizontalBars data={categories.map((c) => ({ label: c.name, value: c.count }))} />
        </ReportCard>
        <ReportCard title="Resource Type Distribution">
          <HorizontalBars data={types.map((t) => ({ label: t.type, value: t.count }))} />
        </ReportCard>
      </div>

      <ReportCard title="Most Popular Resources">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-muted">
            <tr>
              <th className="py-1.5 pr-4 font-medium">#</th>
              <th className="py-1.5 pr-4 font-medium">Resource</th>
              <th className="py-1.5 font-medium">Popularity score</th>
            </tr>
          </thead>
          <tbody>
            {top.map(({ resource, score }, i) => (
              <tr key={resource.id} className="border-t border-border">
                <td className="py-1.5 pr-4 text-muted">{i + 1}</td>
                <td className="py-1.5 pr-4">
                  <Link href={`/resource/${resource.id}`} className="text-foreground hover:text-brand">{resource.title}</Link>
                </td>
                <td className="py-1.5 text-muted">{score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ReportCard>

      <ReportCard title="User Activity">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-muted">
            <tr>
              <th className="py-1.5 pr-4 font-medium">#</th>
              <th className="py-1.5 pr-4 font-medium">User</th>
              <th className="py-1.5 pr-4 font-medium">Email</th>
              <th className="py-1.5 font-medium">Activity score</th>
            </tr>
          </thead>
          <tbody>
            {activeUsers.map(({ user, score }, i) => (
              <tr key={user.id} className="border-t border-border">
                <td className="py-1.5 pr-4 text-muted">{i + 1}</td>
                <td className="py-1.5 pr-4 text-foreground">{user.full_name}</td>
                <td className="py-1.5 pr-4 text-muted">{user.email}</td>
                <td className="py-1.5 text-muted">{score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ReportCard>
    </div>
  );
}

function ReportCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
