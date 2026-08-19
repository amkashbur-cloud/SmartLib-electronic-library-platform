"use client";

import { useMemo, useState } from "react";
import { Badge, Input, Select } from "@/components/ui";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { PublicUser, Role } from "@/lib/types";
import { formatDate } from "@/lib/format";

const ROLES: Role[] = ["student", "researcher", "admin"];

export function AdminUserManager({ initialUsers, currentUserId }: { initialUsers: PublicUser[]; currentUserId: string }) {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const matchesQuery = u.full_name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase());
        const matchesRole = !roleFilter || u.role === roleFilter;
        return matchesQuery && matchesRole;
      }),
    [users, query, roleFilter]
  );

  async function updateUser(id: string, patch: Partial<Pick<PublicUser, "role" | "account_status">>) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const data = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === id ? data.user : u)));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or email…" className="max-w-xs" />
        <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="max-w-[160px]">
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs text-muted">
            <tr>
              <th className="px-4 py-2.5 font-medium">Name</th>
              <th className="px-4 py-2.5 font-medium">Email</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const isSelf = u.id === currentUserId;
              return (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5 font-medium text-foreground">
                    {u.full_name} {isSelf && <span className="text-xs text-muted">(you)</span>}
                  </td>
                  <td className="px-4 py-2.5 text-muted">{u.email}</td>
                  <td className="px-4 py-2.5">
                    <Select
                      value={u.role}
                      disabled={isSelf}
                      onChange={(e) => updateUser(u.id, { role: e.target.value as Role })}
                      className="w-36"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-4 py-2.5">
                    {u.account_status === "active" ? (
                      <ConfirmDialog
                        trigger={<button disabled={isSelf}><Badge tone="success">Active</Badge></button>}
                        title="Deactivate this account?"
                        description={`${u.full_name} will no longer be able to sign in.`}
                        confirmLabel="Deactivate"
                        onConfirm={() => updateUser(u.id, { account_status: "suspended" })}
                      />
                    ) : (
                      <button disabled={isSelf} onClick={() => updateUser(u.id, { account_status: "active" })}>
                        <Badge tone="danger">Suspended</Badge>
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-muted">{formatDate(u.created_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
