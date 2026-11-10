import Link from "next/link";
import { Badge, Card, Empty, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/db";
import { requireClient } from "@/lib/guards";
import { formatDate, formatMoney, invoiceNumber, label } from "@/lib/utils";

export default async function ClientInvoices() {
  const { client } = await requireClient();
  // Drafts are hidden from clients
  const invoices = await prisma.invoice.findMany({
    where: { clientId: client.id, status: { not: "DRAFT" } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader title="Invoices" />
      {invoices.length === 0 ? (
        <Empty>No invoices yet.</Empty>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => (
            <Link key={inv.id} href={`/client/invoices/${inv.id}`}>
              <Card className="flex items-center justify-between transition hover:border-brand-500">
                <div>
                  <p className="font-medium">{invoiceNumber(inv.number)}</p>
                  <p className="text-xs text-slate-500">
                    {inv.description.slice(0, 60)}
                    {inv.dueDate ? ` · Due ${formatDate(inv.dueDate)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{formatMoney(inv.amountPence)}</span>
                  <Badge>{label(inv.status)}</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
