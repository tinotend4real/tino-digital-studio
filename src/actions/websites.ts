"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guards";
import { optStr, str } from "@/lib/utils";
import type { WebsiteStatus } from "@prisma/client";

export async function saveWebsite(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const name = str(formData, "name");
  if (!name) return;

  const data = {
    name,
    url: optStr(formData, "url"),
    hosting: str(formData, "hosting"),
    notes: str(formData, "notes"),
    status: (str(formData, "status") || "DEVELOPMENT") as WebsiteStatus,
    clientId: optStr(formData, "clientId"),
    lastModified: new Date(),
  };

  if (id) await prisma.website.update({ where: { id }, data });
  else await prisma.website.create({ data });

  revalidatePath("/admin/websites");
  redirect("/admin/websites");
}

export async function deleteWebsite(formData: FormData) {
  await requireAdmin();
  await prisma.website.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/admin/websites");
  redirect("/admin/websites");
}
