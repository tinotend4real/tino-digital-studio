import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge, ButtonLink, Card, Empty, PageHeader } from "@/components/ui";
import { formatDate, formatMoney, invoiceNumber, label } from "@/lib/utils";

export default async function AdminInvoices() {
  const invoices = await prisma.invoice.findMany({ orderBy: { createdAt: "desc" }, include: { client: true } });

  return (
    <>
      <PageHeader
        title="Invoices"
        subtitle="Draft invoices are hidden from clients until you mark them Sent."
        action={<ButtonLink href="/admin/invoices/new">New invoice</ButtonLink>}
      />
      {invoices.length === 0 ? (
        <Empty>No invoices yet.</Empty>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Number</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/invoices/${inv.id}`} className="font-medium text-brand-700 hover:underline">
                      {invoiceNumber(inv.number)}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{inv.client.name}</td>
                  <td className="px-5 py-3">{formatMoney(inv.amountPence)}</td>
                  <td className="px-5 py-3">
                    <Badge>{label(inv.status)}</Badge>
                  </td>
                  <td className="px-5 py-3">{inv.dueDate ? formatDate(inv.dueDate) : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
