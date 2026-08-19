import { AdminUserManager } from "@/components/admin/AdminUserManager";
import { getCurrentUser } from "@/lib/session";
import { listUsers } from "@/lib/store";
import { toPublicUser } from "@/lib/types";

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();
  const users = listUsers().map(toPublicUser);

  return (
    <div>
      <p className="mb-4 text-sm text-muted">View, filter, and manage SmartLib accounts.</p>
      <AdminUserManager initialUsers={users} currentUserId={currentUser!.id} />
    </div>
  );
}
