import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge, Card, Empty, PageHeader } from "@/components/ui";
import { formatDate, label } from "@/lib/utils";

export default async function AdminLeads() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageHeader title="Leads" subtitle="Enquiries from the contact form." />
      {leads.length === 0 ? (
        <Empty>No enquiries yet. They'll appear here when someone uses the contact form.</Empty>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Interested in</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/leads/${l.id}`} className="font-medium text-brand-700 hover:underline">
                      {l.name}
                    </Link>
                    <div className="text-xs text-slate-500">{l.email}</div>
                  </td>
                  <td className="px-5 py-3">{l.serviceInterest ?? "-"}</td>
                  <td className="px-5 py-3">
                    <Badge>{label(l.status)}</Badge>
                  </td>
                  <td className="px-5 py-3">{formatDate(l.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
