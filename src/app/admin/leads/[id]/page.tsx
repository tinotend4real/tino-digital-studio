import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteLead, updateLead } from "@/actions/leads";
import { Button, ButtonLink, Card, PageHeader, SelectField, TextArea } from "@/components/ui";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

const statuses = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "PROPOSAL_SENT", label: "Proposal sent" },
  { value: "WON", label: "Won" },
  { value: "LOST", label: "Lost" },
];

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) notFound();

  return (
    <>
      <Link href="/admin/leads" className="text-sm text-slate-500 hover:text-slate-900">
        ← Leads
      </Link>
      <div className="mt-3">
        <PageHeader title={lead.name} subtitle={`Received ${formatDate(lead.createdAt)}`} />
      </div>

      <div className="grid max-w-4xl gap-6 md:grid-cols-2">
        <Card>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-slate-500">Email</dt>
              <dd>
                <a href={`mailto:${lead.email}`} className="text-brand-700 hover:underline">
                  {lead.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Phone</dt>
              <dd>{lead.phone ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Interested in</dt>
              <dd>{lead.serviceInterest ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Message</dt>
              <dd className="whitespace-pre-line">{lead.message}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <form action={updateLead} className="space-y-4">
            <input type="hidden" name="id" value={lead.id} />
            <SelectField label="Status" name="status" defaultValue={lead.status} options={statuses} />
            <TextArea label="Internal notes" name="notes" defaultValue={lead.notes} rows={6} />
            <Button>Save</Button>
          </form>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <ButtonLink
              href={`/admin/quotes/new?name=${encodeURIComponent(lead.name)}&email=${encodeURIComponent(lead.email)}`}
              variant="ghost"
            >
              Create quote for this lead
            </ButtonLink>
          </div>
          <form action={deleteLead} className="mt-4 border-t border-slate-100 pt-4">
            <input type="hidden" name="id" value={lead.id} />
            <Button variant="danger">Delete lead</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
