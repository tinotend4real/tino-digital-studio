import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = { title: "Contact" };

type Props = { searchParams: Promise<{ service?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const { service } = await searchParams;
  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    select: { name: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Get a quote</h1>
      <p className="mt-2 text-slate-600">Tell us a little about your business and what you need. We'll reply within a working day.</p>
      <ContactForm services={services.map((s) => s.name)} selected={service} />
    </div>
  );
}
