import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge, Card, Empty } from "@/components/ui";

export const metadata: Metadata = { title: "Portfolio" };

export default async function PortfolioPage() {
  const projects = await prisma.portfolioItem.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Portfolio</h1>
      <p className="mt-2 max-w-2xl text-slate-600">A selection of websites and projects. Sample projects are marked as such.</p>

      {projects.length === 0 ? (
        <div className="mt-8">
          <Empty>No projects published yet.</Empty>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link key={p.id} href={`/portfolio/${p.slug}`}>
              <Card className="h-full transition hover:border-brand-500">
                <div className="flex flex-wrap gap-2">
                  <Badge>{p.industry || "Project"}</Badge>
                  {p.isSample ? <Badge>Sample project</Badge> : null}
                </div>
                <h2 className="mt-3 text-lg font-semibold">{p.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{p.description}</p>
                {p.tech ? <p className="mt-3 text-xs text-slate-500">{p.tech}</p> : null}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
