"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guards";
import { bool, optStr, slugify, str } from "@/lib/utils";

export async function savePortfolioItem(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const title = str(formData, "title");
  if (!title) return;

  const data = {
    title,
    slug: slugify(str(formData, "slug") || title),
    clientName: str(formData, "clientName"),
    industry: str(formData, "industry"),
    description: str(formData, "description"),
    challenge: str(formData, "challenge"),
    solution: str(formData, "solution"),
    result: str(formData, "result"),
    tech: str(formData, "tech"),
    liveUrl: optStr(formData, "liveUrl"),
    imageUrl: optStr(formData, "imageUrl"),
    isSample: bool(formData, "isSample"),
    featured: bool(formData, "featured"),
    published: bool(formData, "published"),
  };

  if (id) await prisma.portfolioItem.update({ where: { id }, data });
  else await prisma.portfolioItem.create({ data });

  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio");
}

export async function deletePortfolioItem(formData: FormData) {
  await requireAdmin();
  await prisma.portfolioItem.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio");
}
