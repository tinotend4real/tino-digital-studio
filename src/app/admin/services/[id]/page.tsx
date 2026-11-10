import { notFound } from "next/navigation";
import { deleteService } from "@/actions/services";
import { ServiceForm } from "@/components/admin-forms";
import { Button, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/db";

export default async function EditService({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <>
      <PageHeader title={`Edit: ${service.name}`} />
      <ServiceForm service={service} />
      <form action={deleteService} className="mt-10 max-w-2xl border-t border-slate-200 pt-6">
        <input type="hidden" name="id" value={service.id} />
        <Button variant="danger">Delete service</Button>
      </form>
    </>
  );
}
