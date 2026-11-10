import Link from "next/link";
import { prisma } from "@/lib/db";
import { ButtonLink, Card, Empty, PageHeader } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default async function AdminClients() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true } }, _count: { select: { projects: true, tickets: true } } },
  });

  return (
    <>
      <PageHeader
        title="Clients"
        subtitle="Each client gets a login for their dashboard."
        action={<ButtonLink href="/admin/clients/new">Add client</ButtonLink>}
      />
      {clients.length === 0 ? (
        <Empty>No clients yet.</Empty>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Login email</th>
                <th className="px-5 py-3 font-medium">Projects</th>
                <th className="px-5 py-3 font-medium">Tickets</th>
                <th className="px-5 py-3 font-medium">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/clients/${c.id}`} className="font-medium text-brand-700 hover:underline">
                      {c.name}
                    </Link>
                    {c.company ? <div className="text-xs text-slate-500">{c.company}</div> : null}
                  </td>
                  <td className="px-5 py-3">{c.user.email}</td>
                  <td className="px-5 py-3">{c._count.projects}</td>
                  <td className="px-5 py-3">{c._count.tickets}</td>
                  <td className="px-5 py-3">{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
