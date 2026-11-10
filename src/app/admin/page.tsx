import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, PageHeader } from "@/components/ui";
import { formatDate, label } from "@/lib/utils";

export default async function AdminDashboard() {
  const [services, projects, websites, clients, newLeads, openTickets, recentLeads] = await Promise.all([
    prisma.service.count(),
    prisma.portfolioItem.count(),
    prisma.website.count(),
    prisma.client.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.ticket.count({ where: { status: { not: "CLOSED" } } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "New leads", value: newLeads, href: "/admin/leads" },
    { label: "Open tickets", value: openTickets, href: "/admin/tickets" },
    { label: "Clients", value: clients, href: "/admin/clients" },
    { label: "Websites", value: websites, href: "/admin/websites" },
    { label: "Portfolio projects", value: projects, href: "/admin/portfolio" },
    { label: "Services", value: services, href: "/admin/services" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of your studio." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition hover:border-brand-500">
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className="mt-1 text-3xl font-semibold">{s.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold">Recent enquiries</h2>
      <Card className="p-0">
        {recentLeads.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No enquiries yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentLeads.map((l) => (
              <li key={l.id}>
                <Link href={`/admin/leads/${l.id}`} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-slate-50">
                  <span>
                    <span className="font-medium">{l.name}</span>
                    <span className="ml-2 text-slate-500">{l.serviceInterest ?? "General enquiry"}</span>
                  </span>
                  <span className="text-slate-500">
                    {label(l.status)} · {formatDate(l.createdAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
