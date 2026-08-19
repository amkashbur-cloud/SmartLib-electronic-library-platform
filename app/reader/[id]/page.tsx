import { notFound } from "next/navigation";
import { ReaderView } from "@/components/ReaderView";
import { ButtonLink } from "@/components/ui";
import { canAccessResource } from "@/lib/access";
import { generateReaderPages } from "@/lib/reader-content";
import { getCurrentUser } from "@/lib/session";
import { findResourceById, getReadingProgress } from "@/lib/store";

export default async function ReaderPage({ params }: PageProps<"/reader/[id]">) {
  const { id } = await params;
  const resource = findResourceById(id);
  if (!resource) notFound();

  const user = await getCurrentUser();
  const access = canAccessResource(user, resource);

  if (!user || !access.allowed) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <h1 className="text-xl font-semibold text-foreground">You can&apos;t open this reader yet</h1>
        <p className="max-w-sm text-sm text-muted">{access.reason}</p>
        <ButtonLink href={`/resource/${resource.id}`} variant="secondary">Back to resource</ButtonLink>
      </div>
    );
  }

  const pages = generateReaderPages(resource);
  const existing = getReadingProgress(user.id, resource.id);

  return <ReaderView resourceId={resource.id} title={resource.title} pages={pages} initialPage={existing?.last_page ?? 1} />;
}
