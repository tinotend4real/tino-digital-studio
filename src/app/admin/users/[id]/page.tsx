import { notFound } from "next/navigation";
import { deleteAdminUser } from "@/actions/users";
import { Badge, Button, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guards";
import { label } from "@/lib/utils";
import { UserForm } from "./user-form";

export default async function UserSettings({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdmin();
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) notFound();

  const canDelete = user.role === "ADMIN" && user.id !== session.user.id;

  return (
    <>
      <PageHeader title={user.name} subtitle={user.id === session.user.id ? "Your account" : undefined} action={<Badge>{label(user.role)}</Badge>} />
      <UserForm user={{ id: user.id, name: user.name, email: user.email }} />

      {canDelete ? (
        <form action={deleteAdminUser} className="mt-10 max-w-md border-t border-slate-200 pt-6">
          <input type="hidden" name="id" value={user.id} />
          <Button variant="danger">Delete this admin</Button>
        </form>
      ) : null}
      {user.role === "CLIENT" ? (
        <p className="mt-10 max-w-md border-t border-slate-200 pt-6 text-sm text-slate-500">
          To remove a client login, delete the client from the Clients page.
        </p>
      ) : null}
    </>
  );
}
