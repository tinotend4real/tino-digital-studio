import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/db";
import { requireClient } from "@/lib/guards";
import { formatDate, label } from "@/lib/utils";

export default async function ClientProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { client } = await requireClient();

  // Scoped to this client so nobody can open another client's project by guessing an ID.
  const project = await prisma.clientProject.findFirst({
    where: { id, clientId: client.id },
    include: { updates: { orderBy: { createdAt: "desc" } } },
  });
  if (!project) notFound();

  return (
    <>
      <Link href="/client" className="text-sm text-slate-500 hover:text-slate-900">
        ← Projects
      </Link>
      <div className="mt-3">
        <PageHeader title={project.name} subtitle={project.description} action={<Badge>{label(project.status)}</Badge>} />
      </div>

      <h2 className="mb-3 text-lg font-semibold">Updates</h2>
      {project.updates.length === 0 ? (
        <p className="text-sm text-slate-500">No updates yet.</p>
      ) : (
        <div className="space-y-3">
          {project.updates.map((u) => (
            <Card key={u.id}>
              <p className="text-xs text-slate-500">{formatDate(u.createdAt)}</p>
              <p className="mt-1 whitespace-pre-line text-sm">{u.message}</p>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
