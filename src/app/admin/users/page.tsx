import Link from "next/link";
import { Badge, Card, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guards";
import { formatDate, label } from "@/lib/utils";

export default async function AdminUsers() {
  const session = await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: [{ role: "asc" }, { createdAt: "asc" }] });

  return (
    <>
      <PageHeader title="Users" subtitle="Everyone who can log in. New clients are added from the Clients page." />
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-5 py-3">
                  <Link href={`/admin/users/${u.id}`} className="font-medium text-brand-700 hover:underline">
                    {u.name}
                  </Link>
                  {u.id === session.user.id ? <span className="ml-2 text-xs text-slate-500">(you)</span> : null}
                </td>
                <td className="px-5 py-3">{u.email}</td>
                <td className="px-5 py-3">
                  <Badge>{label(u.role)}</Badge>
                </td>
                <td className="px-5 py-3">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
