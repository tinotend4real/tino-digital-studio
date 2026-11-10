"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guards";
import { str } from "@/lib/utils";

export type UserFormState = { ok: boolean; message: string } | undefined;

export async function updateUser(_prev: UserFormState, formData: FormData): Promise<UserFormState> {
  await requireAdmin();
  const id = str(formData, "id");
  const name = str(formData, "name");
  const email = str(formData, "email").toLowerCase();
  const password = str(formData, "password");

  if (!name || !email) return { ok: false, message: "Name and email are required." };
  if (password && password.length < 8) return { ok: false, message: "New password must be at least 8 characters." };

  const clash = await prisma.user.findFirst({ where: { email, NOT: { id } } });
  if (clash) return { ok: false, message: "Another user already uses that email." };

  await prisma.user.update({
    where: { id },
    data: { name, email, ...(password ? { passwordHash: await bcrypt.hash(password, 12) } : {}) },
  });

  revalidatePath("/admin/users");
  return { ok: true, message: password ? "Saved. Password changed." : "Saved." };
}

// Only other admins can be deleted here. Clients are removed from the Clients page.
export async function deleteAdminUser(formData: FormData) {
  const session = await requireAdmin();
  const id = str(formData, "id");
  if (id === session.user.id) return;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role !== "ADMIN") return;

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
  redirect("/admin/users");
}
