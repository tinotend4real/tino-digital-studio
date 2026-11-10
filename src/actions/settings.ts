"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guards";
import { str } from "@/lib/utils";

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const data = {
    siteName: str(formData, "siteName") || "Tino Digital Studio",
    tagline: str(formData, "tagline"),
    contactEmail: str(formData, "contactEmail"),
    phone: str(formData, "phone"),
    location: str(formData, "location"),
    instagram: str(formData, "instagram"),
  };
  await prisma.siteSetting.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
  revalidatePath("/", "layout");
}
