import Link from "next/link";
import { Badge, ButtonLink, Card, Empty, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/db";
import { requireClient } from "@/lib/guards";
import { formatDate, label } from "@/lib/utils";

export default async function ClientTickets() {
  const { client } = await requireClient();
  const tickets = await prisma.ticket.findMany({ where: { clientId: client.id }, orderBy: { updatedAt: "desc" } });

  return (
    <>
      <PageHeader title="Support" action={<ButtonLink href="/client/tickets/new">New ticket</ButtonLink>} />
      {tickets.length === 0 ? (
        <Empty>No tickets yet.</Empty>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Link key={t.id} href={`/client/tickets/${t.id}`}>
              <Card className="flex items-center justify-between transition hover:border-brand-500">
                <div>
                  <p className="font-medium">{t.subject}</p>
                  <p className="text-xs text-slate-500">Updated {formatDate(t.updatedAt)}</p>
                </div>
                <Badge>{label(t.status)}</Badge>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
