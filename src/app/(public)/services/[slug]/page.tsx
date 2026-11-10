import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Badge, ButtonLink } from "@/components/ui";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  return { title: service?.name ?? "Service" };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service || !service.published) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <Link href="/services" className="text-sm text-slate-500 hover:text-slate-900">
        ← All services
      </Link>
      <div className="mt-4">
        <Badge>{service.category}</Badge>
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{service.name}</h1>
      <p className="mt-3 text-lg text-slate-600">{service.summary}</p>
      {service.priceFrom ? <p className="mt-4 text-sm font-medium text-slate-800">From {service.priceFrom}</p> : null}
      <div className="mt-6 whitespace-pre-line text-slate-700">{service.description}</div>
      <div className="mt-8">
        <ButtonLink href={`/contact?service=${encodeURIComponent(service.name)}`}>Ask about {service.name}</ButtonLink>
      </div>
    </div>
  );
}
