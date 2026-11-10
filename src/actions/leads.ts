"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guards";
import { optStr, str } from "@/lib/utils";
import type { LeadStatus } from "@prisma/client";

export type LeadFormState = { ok: boolean; message: string } | undefined;

// Public: contact form
export async function createLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  // Honeypot: real visitors leave this empty
  if (str(formData, "website")) return { ok: true, message: "Thanks, we'll be in touch." };

  const name = str(formData, "name");
  const email = str(formData, "email");
  const message = str(formData, "message");

  if (!name || !email || !message) {
    return { ok: false, message: "Please fill in your name, email and message." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "That email address doesn't look right." };
  }

  await prisma.lead.create({
    data: {
      name,
      email,
      phone: optStr(formData, "phone"),
      serviceInterest: optStr(formData, "service"),
      message,
    },
  });
  revalidatePath("/admin/leads");
  return { ok: true, message: "Thanks, we'll be in touch soon." };
}

// Admin: update status and notes
export async function updateLead(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await prisma.lead.update({
    where: { id },
    data: { status: str(formData, "status") as LeadStatus, notes: str(formData, "notes") },
  });
  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}

export async function deleteLead(formData: FormData) {
  await requireAdmin();
  await prisma.lead.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}
