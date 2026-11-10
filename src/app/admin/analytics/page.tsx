import { Card, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/db";
import { formatMoney, label } from "@/lib/utils";

function Bars({ rows }: { rows: { label: string; value: number; display?: string }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.label} className="text-sm">
          <div className="mb-1 flex justify-between">
            <span>{r.label}</span>
            <span className="text-slate-500">{r.display ?? r.value}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-brand-500" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

const LEAD_ORDER = ["NEW", "CONTACTED", "PROPOSAL_SENT", "WON", "LOST"];
const INVOICE_ORDER = ["DRAFT", "SENT", "OVERDUE", "PAID"];

export default async function AdminAnalytics() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [leads, websites, invoices, quotes, tickets] = await Promise.all([
    prisma.lead.findMany({ select: { status: true, createdAt: true } }),
    prisma.website.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.invoice.groupBy({ by: ["status"], _sum: { amountPence: true } }),
    prisma.quote.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.ticket.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  // Leads per month, last 6 months
  const months: { key: string; label: string; value: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: new Intl.DateTimeFormat("en-GB", { month: "short", year: "2-digit" }).format(d),
      value: 0,
    });
  }
  for (const l of leads) {
    if (l.createdAt < monthStart) continue;
    const m = months.find((x) => x.key === `${l.createdAt.getFullYear()}-${l.createdAt.getMonth()}`);
    if (m) m.value += 1;
  }

  const leadCounts = LEAD_ORDER.map((s) => ({ label: label(s), value: leads.filter((l) => l.status === s).length }));
  const won = leadCounts.find((r) => r.label === "Won")?.value ?? 0;
  const conversion = leads.length ? Math.round((won / leads.length) * 100) : 0;

  const money = (status: string) => invoices.find((i) => i.status === status)?._sum.amountPence ?? 0;
  const outstanding = money("SENT") + money("OVERDUE");

  return (
    <>
      <PageHeader title="Analytics" subtitle="Built from your own data. Visitor traffic isn't tracked." />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Total leads</p>
          <p className="mt-1 text-3xl font-semibold">{leads.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Lead to won rate</p>
          <p className="mt-1 text-3xl font-semibold">{conversion}%</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Outstanding invoices</p>
          <p className="mt-1 text-3xl font-semibold">{formatMoney(outstanding)}</p>
          <p className="mt-1 text-xs text-slate-500">Paid so far: {formatMoney(money("PAID"))}</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold">Leads per month</h2>
          <Bars rows={months} />
        </Card>
        <Card>
          <h2 className="mb-4 font-semibold">Leads by status</h2>
          <Bars rows={leadCounts} />
        </Card>
        <Card>
          <h2 className="mb-4 font-semibold">Invoices by status</h2>
          <Bars
            rows={INVOICE_ORDER.map((s) => ({ label: label(s), value: money(s), display: formatMoney(money(s)) }))}
          />
        </Card>
        <Card>
          <h2 className="mb-4 font-semibold">Websites by status</h2>
          <Bars rows={websites.map((w) => ({ label: label(w.status), value: w._count._all }))} />
        </Card>
        <Card>
          <h2 className="mb-4 font-semibold">Quotes by status</h2>
          <Bars rows={quotes.map((q) => ({ label: label(q.status), value: q._count._all }))} />
        </Card>
        <Card>
          <h2 className="mb-4 font-semibold">Tickets by status</h2>
          <Bars rows={tickets.map((t) => ({ label: label(t.status), value: t._count._all }))} />
        </Card>
      </div>
    </>
  );
}
