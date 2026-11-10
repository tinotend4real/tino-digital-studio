import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ButtonLink, Card } from "@/components/ui";

export const metadata: Metadata = { title: "Pricing" };

export default async function PricingPage() {
  const services = await prisma.service.findMany({
    where: { published: true, priceFrom: { not: null } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Starting prices for each service. Every project is different, so you'll get a fixed quote before any work begins.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Card key={s.id}>
            <h2 className="text-lg font-semibold">{s.name}</h2>
            <p className="mt-2 text-2xl font-semibold text-brand-700">
              <span className="text-sm font-normal text-slate-500">From </span>
              {s.priceFrom}
            </p>
            <p className="mt-3 text-sm text-slate-600">{s.summary}</p>
            <div className="mt-5">
              <ButtonLink href={`/contact?service=${encodeURIComponent(s.name)}`} variant="ghost">
                Get a quote
              </ButtonLink>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
