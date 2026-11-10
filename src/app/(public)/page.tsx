import Link from "next/link";
import { prisma, getSettings } from "@/lib/db";
import { Badge, ButtonLink, Card } from "@/components/ui";

export default async function HomePage() {
  const [settings, services, projects] = await Promise.all([
    getSettings(),
    prisma.service.findMany({ where: { published: true, featured: true }, orderBy: { sortOrder: "asc" }, take: 3 }),
    prisma.portfolioItem.findMany({ where: { published: true, featured: true }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-sm font-medium text-brand-700">Digital studio for small businesses</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">{settings.tagline}</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            Modern websites, ongoing care and content that helps local businesses look professional and get more enquiries.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Get a free quote</ButtonLink>
            <ButtonLink href="/portfolio" variant="ghost">
              See our work
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">What we do</h2>
          <Link href="/services" className="text-sm font-medium text-brand-700 hover:underline">
            All services →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {services.map((s) => (
            <Card key={s.id}>
              <Badge>{s.category}</Badge>
              <h3 className="mt-3 text-lg font-semibold">{s.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.summary}</p>
              <Link href={`/services/${s.slug}`} className="mt-4 inline-block text-sm font-medium text-brand-700 hover:underline">
                Learn more →
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {projects.length > 0 ? (
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Recent work</h2>
            <Link href="/portfolio" className="text-sm font-medium text-brand-700 hover:underline">
              Full portfolio →
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {projects.map((p) => (
              <Link key={p.id} href={`/portfolio/${p.slug}`}>
                <Card className="h-full transition hover:border-brand-500">
                  <Badge>{p.industry || "Project"}</Badge>
                  <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{p.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-14 text-center">
          <h2 className="text-2xl font-semibold text-white">Ready to get online?</h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-300">Tell us about your business and we'll reply with a clear, no-pressure quote.</p>
          <div className="mt-6">
            <ButtonLink href="/contact">Contact us</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
