import { notFound } from "next/navigation";
import { deleteWebsite } from "@/actions/websites";
import { WebsiteForm } from "@/components/admin-forms";
import { Button, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function EditWebsite({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [website, clients] = await Promise.all([
    prisma.website.findUnique({ where: { id } }),
    prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!website) notFound();

  return (
    <>
      <PageHeader title={website.name} subtitle={`Last modified ${formatDate(website.lastModified)}`} />
      <WebsiteForm website={website} clients={clients} />
      <form action={deleteWebsite} className="mt-10 max-w-2xl border-t border-slate-200 pt-6">
        <input type="hidden" name="id" value={website.id} />
        <Button variant="danger">Delete website</Button>
      </form>
    </>
  );
}
