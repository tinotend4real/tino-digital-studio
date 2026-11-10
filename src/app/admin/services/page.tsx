import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge, ButtonLink, Card, Empty, PageHeader } from "@/components/ui";

export default async function AdminServices() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <PageHeader title="Services" action={<ButtonLink href="/admin/services/new">Add service</ButtonLink>} />
      {services.length === 0 ? (
        <Empty>No services yet.</Empty>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price from</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/services/${s.id}`} className="font-medium text-brand-700 hover:underline">
                      {s.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{s.category}</td>
                  <td className="px-5 py-3">{s.priceFrom ?? "-"}</td>
                  <td className="px-5 py-3">
                    <span className="flex gap-1">
                      <Badge>{s.published ? "Published" : "Draft"}</Badge>
                      {s.featured ? <Badge>Featured</Badge> : null}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
