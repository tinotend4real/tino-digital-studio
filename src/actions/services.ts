"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guards";
import { bool, optStr, slugify, str } from "@/lib/utils";

export async function saveService(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const name = str(formData, "name");
  if (!name) return;

  const data = {
    name,
    slug: slugify(str(formData, "slug") || name),
    summary: str(formData, "summary"),
    description: str(formData, "description"),
    priceFrom: optStr(formData, "priceFrom"),
    category: str(formData, "category") || "Web",
    featured: bool(formData, "featured"),
    published: bool(formData, "published"),
    sortOrder: Number(str(formData, "sortOrder")) || 0,
  };

  if (id) await prisma.service.update({ where: { id }, data });
  else await prisma.service.create({ data });

  revalidatePath("/services");
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function deleteService(formData: FormData) {
  await requireAdmin();
  await prisma.service.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/services");
  revalidatePath("/admin/services");
  redirect("/admin/services");
}
