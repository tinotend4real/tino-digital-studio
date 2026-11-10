"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guards";
import { bool, slugify, str } from "@/lib/utils";

export async function saveBlogPost(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const title = str(formData, "title");
  if (!title) return;

  const published = bool(formData, "published");
  const existing = id ? await prisma.blogPost.findUnique({ where: { id } }) : null;

  const data = {
    title,
    slug: slugify(str(formData, "slug") || title),
    excerpt: str(formData, "excerpt"),
    content: str(formData, "content"),
    author: str(formData, "author"),
    category: str(formData, "category") || "General",
    published,
    // Stamp the publish date the first time a post goes live
    publishedAt: published ? (existing?.publishedAt ?? new Date()) : null,
  };

  if (id) await prisma.blogPost.update({ where: { id }, data });
  else await prisma.blogPost.create({ data });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(formData: FormData) {
  await requireAdmin();
  await prisma.blogPost.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}
