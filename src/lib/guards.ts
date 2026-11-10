import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");
  return session;
}

export async function requireClient() {
  const session = await auth();
  if (session?.user?.role !== "CLIENT") redirect("/login");
  const client = await prisma.client.findUnique({ where: { userId: session.user.id } });
  if (!client) redirect("/login");
  return { session, client };
}
