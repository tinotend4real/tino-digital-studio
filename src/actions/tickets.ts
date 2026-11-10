"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { requireAdmin, requireClient } from "@/lib/guards";
import { str } from "@/lib/utils";
import type { TicketStatus } from "@prisma/client";

// Client: open a new ticket
export async function createTicket(formData: FormData) {
  const { client } = await requireClient();
  const subject = str(formData, "subject");
  const body = str(formData, "body");
  if (!subject || !body) return;

  const ticket = await prisma.ticket.create({
    data: { subject, clientId: client.id, messages: { create: { body, fromAdmin: false } } },
  });
  revalidatePath("/client/tickets");
  revalidatePath("/admin/tickets");
  redirect(`/client/tickets/${ticket.id}`);
}

// Client or admin: reply on a ticket. Clients can only reply on their own tickets.
export async function replyToTicket(formData: FormData) {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "CLIENT") redirect("/login");

  const ticketId = str(formData, "ticketId");
  const body = str(formData, "body");
  if (!body) return;

  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId }, include: { client: true } });
  if (!ticket) return;
  if (role === "CLIENT" && ticket.client.userId !== session!.user.id) redirect("/login");

  await prisma.ticketMessage.create({ data: { ticketId, body, fromAdmin: role === "ADMIN" } });
  // A client reply reopens a closed ticket; an admin reply marks it in progress.
  await prisma.ticket.update({
    where: { id: ticketId },
    data: { status: role === "ADMIN" ? "IN_PROGRESS" : "OPEN" },
  });

  revalidatePath(`/client/tickets/${ticketId}`);
  revalidatePath(`/admin/tickets/${ticketId}`);
}

export async function setTicketStatus(formData: FormData) {
  await requireAdmin();
  const ticketId = str(formData, "ticketId");
  await prisma.ticket.update({
    where: { id: ticketId },
    data: { status: str(formData, "status") as TicketStatus },
  });
  revalidatePath(`/admin/tickets/${ticketId}`);
  revalidatePath("/admin/tickets");
}
