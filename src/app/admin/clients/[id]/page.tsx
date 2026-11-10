import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addProjectUpdate,
  createClientProject,
  deleteClient,
  setProjectStatus,
} from "@/actions/clients";
import { Badge, Button, Card, Field, PageHeader, SelectField, TextArea } from "@/components/ui";
import { prisma } from "@/lib/db";
import { formatDate, label } from "@/lib/utils";

const projectStatuses = [
  { value: "PLANNING", label: "Planning" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "REVIEW", label: "In review" },
  { value: "LIVE", label: "Live" },
];

export default async function ClientDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      user: { select: { email: true } },
      projects: { orderBy: { createdAt: "desc" }, include: { updates: { orderBy: { createdAt: "desc" } } } },
    },
  });
  if (!client) notFound();

  return (
    <>
      <Link href="/admin/clients" className="text-sm text-slate-500 hover:text-slate-900">
        ← Clients
      </Link>
      <div className="mt-3">
        <PageHeader title={client.name} subtitle={[client.company, client.user.email, client.phone].filter(Boolean).join(" · ")} />
      </div>

      <h2 className="mb-3 text-lg font-semibold">Projects</h2>
      <div className="max-w-3xl space-y-4">
        {client.projects.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{p.name}</h3>
                {p.description ? <p className="mt-1 text-sm text-slate-600">{p.description}</p> : null}
              </div>
              <Badge>{label(p.status)}</Badge>
            </div>

            <form action={setProjectStatus} className="mt-4 flex items-end gap-3">
              <input type="hidden" name="projectId" value={p.id} />
              <input type="hidden" name="clientId" value={client.id} />
              <SelectField label="Status" name="status" defaultValue={p.status} options={projectStatuses} />
              <Button variant="ghost">Update</Button>
            </form>

            <form action={addProjectUpdate} className="mt-4 space-y-2">
              <input type="hidden" name="projectId" value={p.id} />
              <input type="hidden" name="clientId" value={client.id} />
              <TextArea label="Post an update for the client" name="message" rows={2} />
              <Button variant="ghost">Post update</Button>
            </form>

            {p.updates.length > 0 ? (
              <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                {p.updates.map((u) => (
                  <li key={u.id}>
                    <span className="text-slate-500">{formatDate(u.createdAt)}: </span>
                    {u.message}
                  </li>
                ))}
              </ul>
            ) : null}
          </Card>
        ))}

        <Card>
          <h3 className="mb-3 font-semibold">Add project</h3>
          <form action={createClientProject} className="space-y-3">
            <input type="hidden" name="clientId" value={client.id} />
            <Field label="Project name" name="name" required />
            <TextArea label="Description" name="description" rows={2} />
            <Button>Add project</Button>
          </form>
        </Card>
      </div>

      <form action={deleteClient} className="mt-10 max-w-3xl border-t border-slate-200 pt-6">
        <input type="hidden" name="id" value={client.id} />
        <Button variant="danger">Delete client and login</Button>
      </form>
    </>
  );
}
