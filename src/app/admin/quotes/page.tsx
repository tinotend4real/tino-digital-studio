import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge, ButtonLink, Card, Empty, PageHeader } from "@/components/ui";
import { formatDate, formatMoney, label, quoteNumber } from "@/lib/utils";

export default async function AdminQuotes() {
  const quotes = await prisma.quote.findMany({ orderBy: { createdAt: "desc" }, include: { items: true } });

  return (
    <>
      <PageHeader title="Quotes" action={<ButtonLink href="/admin/quotes/new">New quote</ButtonLink>} />
      {quotes.length === 0 ? (
        <Empty>No quotes yet. Build one here, or start from a lead.</Empty>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Quote</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotes.map((q) => {
                const total = q.items.reduce((sum, i) => sum + i.quantity * i.unitPence, 0);
                return (
                  <tr key={q.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <Link href={`/admin/quotes/${q.id}`} className="font-medium text-brand-700 hover:underline">
                        {quoteNumber(q.number)}
                      </Link>
                      <div className="text-xs text-slate-500">{q.title}</div>
                    </td>
                    <td className="px-5 py-3">{q.clientName}</td>
                    <td className="px-5 py-3">{formatMoney(total)}</td>
                    <td className="px-5 py-3">
                      <Badge>{label(q.status)}</Badge>
                    </td>
                    <td className="px-5 py-3">{formatDate(q.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
