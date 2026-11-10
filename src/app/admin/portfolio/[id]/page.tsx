import { notFound } from "next/navigation";
import { deletePortfolioItem } from "@/actions/portfolio";
import { PortfolioForm } from "@/components/admin-forms";
import { Button, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/db";

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.portfolioItem.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <>
      <PageHeader title={`Edit: ${item.title}`} />
      <PortfolioForm item={item} />
      <form action={deletePortfolioItem} className="mt-10 max-w-2xl border-t border-slate-200 pt-6">
        <input type="hidden" name="id" value={item.id} />
        <Button variant="danger">Delete project</Button>
      </form>
    </>
  );
}
