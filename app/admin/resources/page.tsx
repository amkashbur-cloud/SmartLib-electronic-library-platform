import { AdminResourceManager } from "@/components/admin/AdminResourceManager";
import { listAuthors, listCategories, listResources } from "@/lib/store";

export default async function AdminResourcesPage() {
  const { items } = listResources({ pageSize: 1000, sort: "newest" });
  const authors = listAuthors();
  const categories = listCategories();

  return (
    <div>
      <p className="mb-4 text-sm text-muted">Add, edit, and manage the SmartLib catalog.</p>
      <AdminResourceManager initialResources={items} authors={authors} categories={categories} />
    </div>
  );
}
