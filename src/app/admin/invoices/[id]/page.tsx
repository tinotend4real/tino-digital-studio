import { notFound } from "next/navigation";
import { deleteInvoice } from "@/actions/invoices";
import { InvoiceForm } from "@/components/invoice-form";
import { Button, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/db";
import { invoiceNumber } from "@/lib/utils";

export default async function EditInvoice({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [invoice, clients] = await Promise.all([
    prisma.invoice.findUnique({ where: { id } }),
    prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!invoice) notFound();

  return (
    <>
      <PageHeader title={invoiceNumber(invoice.number)} />
      <InvoiceForm invoice={invoice} clients={clients} />
      <form action={deleteInvoice} className="mt-10 max-w-xl border-t border-slate-200 pt-6">
        <input type="hidden" name="id" value={invoice.id} />
        <Button variant="danger">Delete invoice</Button>
      </form>
    </>
  );
}
