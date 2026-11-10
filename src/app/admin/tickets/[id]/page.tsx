import Link from "next/link";
import { notFound } from "next/navigation";
import { replyToTicket, setTicketStatus } from "@/actions/tickets";
import { Badge, Button, Card, PageHeader, SelectField, TextArea } from "@/components/ui";
import { prisma } from "@/lib/db";
import { formatDate, label } from "@/lib/utils";

export default async function AdminTicket({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: { client: true, messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!ticket) notFound();

  return (
    <>
      <Link href="/admin/tickets" className="text-sm text-slate-500 hover:text-slate-900">
        ← Tickets
      </Link>
      <div className="mt-3">
        <PageHeader title={ticket.subject} subtitle={`From ${ticket.client.name}`} action={<Badge>{label(ticket.status)}</Badge>} />
      </div>

      <div className="max-w-3xl space-y-3">
        {ticket.messages.map((m) => (
          <Card key={m.id} className={m.fromAdmin ? "border-brand-100 bg-brand-50" : ""}>
            <p className="text-xs text-slate-500">
              {m.fromAdmin ? "You" : ticket.client.name} · {formatDate(m.createdAt)}
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

        <Card>
          <form action={setTicketStatus} className="flex items-end gap-3">
            <input type="hidden" name="ticketId" value={ticket.id} />
            <SelectField
              label="Ticket status"
              name="status"
              defaultValue={ticket.status}
              options={[
                { value: "OPEN", label: "Open" },
                { value: "IN_PROGRESS", label: "In progress" },
                { value: "CLOSED", label: "Closed" },
              ]}
            />
            <Button variant="ghost">Update</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
