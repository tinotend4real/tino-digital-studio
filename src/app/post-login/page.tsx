import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Sends people to the right area after they log in.
export default async function PostLogin() {
  const session = await auth();
  if (session?.user?.role === "ADMIN") redirect("/admin");
  if (session?.user?.role === "CLIENT") redirect("/client");
  redirect("/login");
}
