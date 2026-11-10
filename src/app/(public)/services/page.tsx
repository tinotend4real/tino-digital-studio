import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge, Card, Empty } from "@/components/ui";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Services</h1>
      <p className="mt-2 max-w-2xl text-slate-600">Everything a small business needs to look good and be found online.</p>

      {services.length === 0 ? (
        <div className="mt-8">
          <Empty>No services published yet.</Empty>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link key={s.id} href={`/services/${s.slug}`}>
              <Card className="h-full transition hover:border-brand-500">
                <div className="flex items-center justify-between">
                  <Badge>{s.category}</Badge>
                  {s.priceFrom ? <span className="text-sm font-medium text-slate-700">From {s.priceFrom}</span> : null}
                </div>
                <h2 className="mt-3 text-lg font-semibold">{s.name}</h2>
                <p className="mt-2 text-sm text-slate-600">{s.summary}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
