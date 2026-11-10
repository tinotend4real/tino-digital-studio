import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge, ButtonLink, Card, Empty, PageHeader } from "@/components/ui";

export default async function AdminPortfolio() {
  const items = await prisma.portfolioItem.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageHeader
        title="Portfolio"
        subtitle="Projects shown on the public site."
        action={<ButtonLink href="/admin/portfolio/new">Add project</ButtonLink>}
      />
      {items.length === 0 ? (
        <Empty>No projects yet.</Empty>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Project</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Industry</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/portfolio/${p.id}`} className="font-medium text-brand-700 hover:underline">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{p.clientName}</td>
                  <td className="px-5 py-3">{p.industry || "-"}</td>
                  <td className="px-5 py-3">
                    <span className="flex gap-1">
                      <Badge>{p.published ? "Published" : "Draft"}</Badge>
                      {p.isSample ? <Badge>Sample</Badge> : null}
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
