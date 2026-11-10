import Link from "next/link";
import { notFound } from "next/navigation";
import { replyToTicket } from "@/actions/tickets";
import { Badge, Button, Card, PageHeader, TextArea } from "@/components/ui";
import { prisma } from "@/lib/db";
import { requireClient } from "@/lib/guards";
import { formatDate, label } from "@/lib/utils";

export default async function ClientTicket({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { client } = await requireClient();

  // Scoped to this client so other clients' tickets are never reachable.
  const ticket = await prisma.ticket.findFirst({
    where: { id, clientId: client.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!ticket) notFound();

  return (
    <>
      <Link href="/client/tickets" className="text-sm text-slate-500 hover:text-slate-900">
        ← Support
      </Link>
      <div className="mt-3">
        <PageHeader title={ticket.subject} action={<Badge>{label(ticket.status)}</Badge>} />
      </div>

      <div className="space-y-3">
        {ticket.messages.map((m) => (
          <Card key={m.id} className={m.fromAdmin ? "border-brand-100 bg-brand-50" : ""}>
            <p className="text-xs text-slate-500">
              {m.fromAdmin ? "Studio" : "You"} · {formatDate(m.createdAt)}
            </p>
            <p className="mt-1 whitespace-pre-line text-sm">{m.body}</p>
          </Card>
        ))}

        <Card>
          <form action={replyToTicket} className="space-y-3">
            <input type="hidden" name="ticketId" value={ticket.id} />
            <TextArea label="Reply" name="body" rows={4} required />
            <Button>Send reply</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
