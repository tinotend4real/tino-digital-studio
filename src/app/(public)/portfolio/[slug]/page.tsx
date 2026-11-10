import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Badge, ButtonLink } from "@/components/ui";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await prisma.portfolioItem.findUnique({ where: { slug } });
  return { title: item?.title ?? "Project" };
}

function Block({ title, text }: { title: string; text: string }) {
  if (!text) return null;
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 whitespace-pre-line text-slate-700">{text}</p>
    </section>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const item = await prisma.portfolioItem.findUnique({ where: { slug } });
  if (!item || !item.published) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <Link href="/portfolio" className="text-sm text-slate-500 hover:text-slate-900">
        ← Portfolio
      </Link>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{item.industry || "Project"}</Badge>
        {item.isSample ? <Badge>Sample project</Badge> : null}
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{item.title}</h1>
      <p className="mt-2 text-slate-500">{item.clientName}</p>
      <p className="mt-4 text-lg text-slate-600">{item.description}</p>

      <Block title="The challenge" text={item.challenge} />
      <Block title="The solution" text={item.solution} />
      <Block title="The result" text={item.result} />
      <Block title="Built with" text={item.tech} />

      <div className="mt-8 flex flex-wrap gap-3">
        {item.liveUrl ? (
          <a
            href={item.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Visit site ↗
          </a>
        ) : null}
        <ButtonLink href="/contact">Start a similar project</ButtonLink>
      </div>
    </div>
  );
}
