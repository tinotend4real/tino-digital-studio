"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guards";
import { parseDate, parsePounds, str } from "@/lib/utils";
import type { InvoiceStatus } from "@prisma/client";

export type InvoiceFormState = { error: string } | undefined;

export async function saveInvoice(_prev: InvoiceFormState, formData: FormData): Promise<InvoiceFormState> {
  await requireAdmin();
  const id = str(formData, "id");
  const clientId = str(formData, "clientId");
  const description = str(formData, "description");
  const amountPence = parsePounds(str(formData, "amount"));

  if (!clientId) return { error: "Choose a client." };
  if (!description) return { error: "Add a description." };
  if (amountPence === null || amountPence === 0) return { error: "Enter a valid amount in pounds, e.g. 450 or 450.00." };

  const data = {
    clientId,
    description,
    amountPence,
    status: (str(formData, "status") || "DRAFT") as InvoiceStatus,
    dueDate: parseDate(str(formData, "dueDate")),
  };

  if (id) await prisma.invoice.update({ where: { id }, data });
  else await prisma.invoice.create({ data });

  revalidatePath("/admin/invoices");
  revalidatePath("/client/invoices");
  redirect("/admin/invoices");
}

export async function deleteInvoice(formData: FormData) {
  await requireAdmin();
  await prisma.invoice.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/admin/invoices");
  revalidatePath("/client/invoices");
  redirect("/admin/invoices");
}
