import { InvoiceForm } from "@/components/invoice-form";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/db";

type Props = { searchParams: Promise<{ clientId?: string }> };

export default async function NewInvoice({ searchParams }: Props) {
  const { clientId } = await searchParams;
  const clients = await prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  return (
    <>
      <PageHeader title="New invoice" />
      <InvoiceForm clients={clients} defaultClientId={clientId} />
    </>
  );
}
