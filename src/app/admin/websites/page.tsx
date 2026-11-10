import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge, ButtonLink, Card, Empty, PageHeader } from "@/components/ui";
import { formatDate, label } from "@/lib/utils";

export default async function AdminWebsites() {
  const websites = await prisma.website.findMany({ orderBy: { lastModified: "desc" }, include: { client: true } });

  return (
    <>
      <PageHeader
        title="Website inventory"
        subtitle="Every website you've built or manage."
        action={<ButtonLink href="/admin/websites/new">Add website</ButtonLink>}
      />
      {websites.length === 0 ? (
        <Empty>No websites yet.</Empty>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Website</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Last modified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {websites.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/websites/${w.id}`} className="font-medium text-brand-700 hover:underline">
                      {w.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{w.client?.name ?? "Sample / own"}</td>
                  <td className="px-5 py-3">
                    <Badge>{label(w.status)}</Badge>
                  </td>
                  <td className="px-5 py-3">{formatDate(w.lastModified)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
