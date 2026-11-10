import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteQuote } from "@/actions/quotes";
import { QuoteForm } from "@/components/quote-form";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { getSettings, prisma } from "@/lib/db";
import { formatDate, formatMoney, label, quoteNumber } from "@/lib/utils";

export default async function QuoteDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [quote, settings] = await Promise.all([
    prisma.quote.findUnique({ where: { id }, include: { items: { orderBy: { id: "asc" } } } }),
    getSettings(),
  ]);
  if (!quote) notFound();

  const total = quote.items.reduce((sum, i) => sum + i.quantity * i.unitPence, 0);

  return (
    <>
      <Link href="/admin/quotes" className="text-sm text-slate-500 hover:text-slate-900">
        ← Quotes
      </Link>
      <div className="mt-3">
        <PageHeader
          title={`${quoteNumber(quote.number)}: ${quote.title}`}
          subtitle="Use your browser's Print / Save as PDF on this page to send it."
          action={<Badge>{label(quote.status)}</Badge>}
        />
      </div>

      {/* Formatted quote */}
      <Card className="mb-10 max-w-3xl">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <p className="text-lg font-semibold">{settings.siteName}</p>
            <p className="text-sm text-slate-500">{settings.contactEmail}</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold">Quote {quoteNumber(quote.number)}</p>
            <p className="text-slate-500">Date: {formatDate(quote.createdAt)}</p>
            {quote.validUntil ? <p className="text-slate-500">Valid until: {formatDate(quote.validUntil)}</p> : null}
          </div>
        </div>

        <div className="mt-6 text-sm">
          <p className="text-slate-500">Prepared for</p>
          <p className="font-medium">{quote.clientName}</p>
          {quote.clientEmail ? <p>{quote.clientEmail}</p> : null}
        </div>

        <table className="mt-6 w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-2 font-medium">Description</th>
              <th className="py-2 text-right font-medium">Qty</th>
              <th className="py-2 text-right font-medium">Unit price</th>
              <th className="py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {quote.items.map((i) => (
              <tr key={i.id}>
                <td className="py-2">{i.description}</td>
                <td className="py-2 text-right">{i.quantity}</td>
                <td className="py-2 text-right">{formatMoney(i.unitPence)}</td>
                <td className="py-2 text-right">{formatMoney(i.quantity * i.unitPence)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-300">
              <td colSpan={3} className="py-3 text-right font-semibold">
                Total
              </td>
              <td className="py-3 text-right font-semibold">{formatMoney(total)}</td>
            </tr>
          </tfoot>
        </table>

        {quote.notes ? <p className="mt-4 whitespace-pre-line text-sm text-slate-600">{quote.notes}</p> : null}
      </Card>

      <h2 className="mb-3 text-lg font-semibold">Edit quote</h2>
      <QuoteForm quote={quote} items={quote.items} />

      <form action={deleteQuote} className="mt-10 max-w-3xl border-t border-slate-200 pt-6">
        <input type="hidden" name="id" value={quote.id} />
        <Button variant="danger">Delete quote</Button>
      </form>
    </>
  );
}
