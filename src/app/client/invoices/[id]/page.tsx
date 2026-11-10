import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card, PageHeader } from "@/components/ui";
import { getSettings, prisma } from "@/lib/db";
import { requireClient } from "@/lib/guards";
import { formatDate, formatMoney, invoiceNumber, label } from "@/lib/utils";

export default async function ClientInvoice({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { client } = await requireClient();

  // Scoped to this client, and drafts are never shown
  const [invoice, settings] = await Promise.all([
    prisma.invoice.findFirst({ where: { id, clientId: client.id, status: { not: "DRAFT" } } }),
    getSettings(),
  ]);
  if (!invoice) notFound();

  return (
    <>
      <Link href="/client/invoices" className="text-sm text-slate-500 hover:text-slate-900">
        ← Invoices
      </Link>
      <div className="mt-3">
        <PageHeader title={invoiceNumber(invoice.number)} action={<Badge>{label(invoice.status)}</Badge>} />
      </div>

      <Card className="max-w-xl">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-slate-500">From</dt>
            <dd>
              {settings.siteName} · {settings.contactEmail}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Issued</dt>
            <dd>{formatDate(invoice.createdAt)}</dd>
          </div>
          {invoice.dueDate ? (
            <div>
              <dt className="text-slate-500">Due</dt>
              <dd>{formatDate(invoice.dueDate)}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-slate-500">Description</dt>
            <dd className="whitespace-pre-line">{invoice.description}</dd>
          </div>
          <div className="border-t border-slate-200 pt-3">
            <dt className="text-slate-500">Amount</dt>
            <dd className="text-2xl font-semibold">{formatMoney(invoice.amountPence)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-slate-500">
          Payment details will be sent with your invoice. Questions? Open a ticket under Support.
        </p>
      </Card>
    </>
  );
}
