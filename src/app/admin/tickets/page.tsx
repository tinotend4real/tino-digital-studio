import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge, Card, Empty, PageHeader } from "@/components/ui";
import { formatDate, label } from "@/lib/utils";

export default async function AdminTickets() {
  const tickets = await prisma.ticket.findMany({ orderBy: { updatedAt: "desc" }, include: { client: true } });

  return (
    <>
      <PageHeader title="Support tickets" subtitle="Messages from clients." />
      {tickets.length === 0 ? (
        <Empty>No tickets yet.</Empty>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Subject</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/tickets/${t.id}`} className="font-medium text-brand-700 hover:underline">
                      {t.subject}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{t.client.name}</td>
                  <td className="px-5 py-3">
                    <Badge>{label(t.status)}</Badge>
                  </td>
                  <td className="px-5 py-3">{formatDate(t.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
