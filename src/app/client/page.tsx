import Link from "next/link";
import { Badge, ButtonLink, Card, Empty, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/db";
import { requireClient } from "@/lib/guards";
import { label } from "@/lib/utils";

export default async function ClientHome() {
  const { client } = await requireClient();
  const [projects, openTickets] = await Promise.all([
    prisma.clientProject.findMany({ where: { clientId: client.id }, orderBy: { createdAt: "desc" } }),
    prisma.ticket.count({ where: { clientId: client.id, status: { not: "CLOSED" } } }),
  ]);

  return (
    <>
      <PageHeader
        title={`Welcome, ${client.name}`}
        subtitle={`${openTickets} open support ${openTickets === 1 ? "ticket" : "tickets"}`}
        action={<ButtonLink href="/client/tickets/new">Contact support</ButtonLink>}
      />

      <h2 className="mb-3 text-lg font-semibold">Your projects</h2>
      {projects.length === 0 ? (
        <Empty>No projects yet. They'll appear here once your project starts.</Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <Link key={p.id} href={`/client/projects/${p.id}`}>
              <Card className="h-full transition hover:border-brand-500">
                <Badge>{label(p.status)}</Badge>
                <h3 className="mt-3 font-semibold">{p.name}</h3>
                {p.description ? <p className="mt-1 text-sm text-slate-600">{p.description}</p> : null}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
