"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guards";
import { optStr, str } from "@/lib/utils";
import type { ProjectStatus } from "@prisma/client";

export type ClientFormState = { error: string } | undefined;

// Creates a login (User with role CLIENT) and the Client record together.
export async function createClient(_prev: ClientFormState, formData: FormData): Promise<ClientFormState> {
  await requireAdmin();
  const name = str(formData, "name");
  const email = str(formData, "email").toLowerCase();
  const password = str(formData, "password");

  if (!name || !email || password.length < 8) {
    return { error: "Name and email are required, and the password needs at least 8 characters." };
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "A user with that email already exists." };

  const client = await prisma.client.create({
    data: {
      name,
      company: optStr(formData, "company"),
      phone: optStr(formData, "phone"),
      user: {
        create: { email, name, role: "CLIENT", passwordHash: await bcrypt.hash(password, 12) },
      },
    },
  });

  revalidatePath("/admin/clients");
  redirect(`/admin/clients/${client.id}`);
}

export async function deleteClient(formData: FormData) {
  await requireAdmin();
  const client = await prisma.client.findUnique({ where: { id: str(formData, "id") } });
  if (client) await prisma.user.delete({ where: { id: client.userId } }); // cascades to Client
  revalidatePath("/admin/clients");
  redirect("/admin/clients");
}

export async function createClientProject(formData: FormData) {
  await requireAdmin();
  const clientId = str(formData, "clientId");
  const name = str(formData, "name");
  if (!name) return;
  await prisma.clientProject.create({
    data: { clientId, name, description: str(formData, "description") },
  });
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function setProjectStatus(formData: FormData) {
  await requireAdmin();
  const clientId = str(formData, "clientId");
  await prisma.clientProject.update({
    where: { id: str(formData, "projectId") },
    data: { status: str(formData, "status") as ProjectStatus },
  });
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function addProjectUpdate(formData: FormData) {
  await requireAdmin();
  const clientId = str(formData, "clientId");
  const message = str(formData, "message");
  if (!message) return;
  await prisma.projectUpdate.create({
    data: { projectId: str(formData, "projectId"), message },
  });
  revalidatePath(`/admin/clients/${clientId}`);
}
