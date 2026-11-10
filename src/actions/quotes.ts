"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guards";
import { parseDate, parsePounds, QUOTE_ROWS, str } from "@/lib/utils";
import type { QuoteStatus } from "@prisma/client";

export type QuoteFormState = { error: string } | undefined;

export async function saveQuote(_prev: QuoteFormState, formData: FormData): Promise<QuoteFormState> {
  await requireAdmin();
  const id = str(formData, "id");
  const title = str(formData, "title");
  const clientName = str(formData, "clientName");
  if (!title || !clientName) return { error: "Add a quote title and the client's name." };

  // Read the line-item rows; blank rows are ignored.
  const items: { description: string; quantity: number; unitPence: number }[] = [];
  for (let i = 0; i < QUOTE_ROWS; i++) {
    const description = str(formData, `desc_${i}`);
    if (!description) continue;
    const quantity = Math.max(1, Math.floor(Number(str(formData, `qty_${i}`)) || 1));
    const unitPence = parsePounds(str(formData, `price_${i}`) || "0");
    if (unitPence === null) return { error: `Line ${i + 1}: the price isn't a valid amount.` };
    items.push({ description, quantity, unitPence });
  }
  if (items.length === 0) return { error: "Add at least one line item." };

  const data = {
    title,
    clientName,
    clientEmail: str(formData, "clientEmail"),
    notes: str(formData, "notes"),
    status: (str(formData, "status") || "DRAFT") as QuoteStatus,
    validUntil: parseDate(str(formData, "validUntil")),
  };

  let quoteId = id;
  if (id) {
    await prisma.$transaction([
      prisma.quoteItem.deleteMany({ where: { quoteId: id } }),
      prisma.quote.update({ where: { id }, data: { ...data, items: { create: items } } }),
    ]);
  } else {
    const created = await prisma.quote.create({ data: { ...data, items: { create: items } } });
    quoteId = created.id;
  }

  revalidatePath("/admin/quotes");
  redirect(`/admin/quotes/${quoteId}`);
}

export async function deleteQuote(formData: FormData) {
  await requireAdmin();
  await prisma.quote.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/admin/quotes");
  redirect("/admin/quotes");
}
