import type { PortfolioItem, Service, Website } from "@prisma/client";
import { saveService } from "@/actions/services";
import { savePortfolioItem } from "@/actions/portfolio";
import { saveWebsite } from "@/actions/websites";
import { Button, ButtonLink, Checkbox, Field, SelectField, TextArea } from "@/components/ui";

export function ServiceForm({ service }: { service?: Service }) {
  return (
    <form action={saveService} className="max-w-2xl space-y-4">
      <input type="hidden" name="id" defaultValue={service?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" name="name" defaultValue={service?.name} required />
        <Field label="URL slug (optional)" name="slug" defaultValue={service?.slug} placeholder="auto-generated from name" />
      </div>
      <TextArea label="Short summary" name="summary" defaultValue={service?.summary} rows={2} required />
      <TextArea label="Full description" name="description" defaultValue={service?.description} rows={6} />
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Price from" name="priceFrom" defaultValue={service?.priceFrom} placeholder="£450" />
        <Field label="Category" name="category" defaultValue={service?.category ?? "Web"} />
        <Field label="Sort order" name="sortOrder" type="number" defaultValue={service?.sortOrder ?? 0} />
      </div>
      <div className="flex gap-6">
        <Checkbox label="Featured on home page" name="featured" defaultChecked={service?.featured} />
        <Checkbox label="Published" name="published" defaultChecked={service?.published ?? true} />
      </div>
      <div className="flex gap-3">
        <Button>Save service</Button>
        <ButtonLink href="/admin/services" variant="ghost">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}

export function PortfolioForm({ item }: { item?: PortfolioItem }) {
  return (
    <form action={savePortfolioItem} className="max-w-2xl space-y-4">
      <input type="hidden" name="id" defaultValue={item?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Project title" name="title" defaultValue={item?.title} required />
        <Field label="URL slug (optional)" name="slug" defaultValue={item?.slug} placeholder="auto-generated from title" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Client name" name="clientName" defaultValue={item?.clientName} required />
        <Field label="Industry" name="industry" defaultValue={item?.industry} placeholder="Fitness" />
      </div>
      <TextArea label="Short description" name="description" defaultValue={item?.description} rows={2} />
      <TextArea label="The challenge" name="challenge" defaultValue={item?.challenge} rows={3} />
      <TextArea label="The solution" name="solution" defaultValue={item?.solution} rows={3} />
      <TextArea label="The result" name="result" defaultValue={item?.result} rows={3} />
      <Field label="Technology used" name="tech" defaultValue={item?.tech} placeholder="Next.js, Tailwind CSS" />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Live link" name="liveUrl" defaultValue={item?.liveUrl} placeholder="https://" />
        <Field label="Screenshot URL" name="imageUrl" defaultValue={item?.imageUrl} placeholder="https://" />
      </div>
      <div className="flex flex-wrap gap-6">
        <Checkbox label="Sample project (not a real client)" name="isSample" defaultChecked={item?.isSample ?? true} />
        <Checkbox label="Featured on home page" name="featured" defaultChecked={item?.featured} />
        <Checkbox label="Published" name="published" defaultChecked={item?.published ?? true} />
      </div>
      <div className="flex gap-3">
        <Button>Save project</Button>
        <ButtonLink href="/admin/portfolio" variant="ghost">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}

export function WebsiteForm({
  website,
  clients,
}: {
  website?: Website;
  clients: { id: string; name: string }[];
}) {
  return (
    <form action={saveWebsite} className="max-w-2xl space-y-4">
      <input type="hidden" name="id" defaultValue={website?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Website name" name="name" defaultValue={website?.name} required />
        <Field label="Live URL" name="url" defaultValue={website?.url} placeholder="https://" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="Client"
          name="clientId"
          defaultValue={website?.clientId ?? ""}
          options={[{ value: "", label: "No client (sample or own project)" }, ...clients.map((c) => ({ value: c.id, label: c.name }))]}
        />
        <SelectField
          label="Status"
          name="status"
          defaultValue={website?.status ?? "DEVELOPMENT"}
          options={[
            { value: "DEVELOPMENT", label: "In development" },
            { value: "ACTIVE", label: "Active" },
            { value: "PAUSED", label: "Paused" },
          ]}
        />
      </div>
      <Field label="Hosting details" name="hosting" defaultValue={website?.hosting} placeholder="Vercel, domain at …" />
      <TextArea label="Notes and updates" name="notes" defaultValue={website?.notes} rows={5} />
      <div className="flex gap-3">
        <Button>Save website</Button>
        <ButtonLink href="/admin/websites" variant="ghost">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}
