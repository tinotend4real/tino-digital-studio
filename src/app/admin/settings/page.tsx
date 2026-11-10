import { saveSettings } from "@/actions/settings";
import { Button, Field, PageHeader } from "@/components/ui";
import { getSettings } from "@/lib/db";

export default async function AdminSettings() {
  const s = await getSettings();

  return (
    <>
      <PageHeader title="Settings" subtitle="Shown in the site header, footer and contact details." />
      <form action={saveSettings} className="max-w-xl space-y-4">
        <Field label="Site name" name="siteName" defaultValue={s.siteName} required />
        <Field label="Tagline (home page headline)" name="tagline" defaultValue={s.tagline} />
        <Field label="Contact email" name="contactEmail" type="email" defaultValue={s.contactEmail} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Phone" name="phone" defaultValue={s.phone} />
          <Field label="Location" name="location" defaultValue={s.location} />
        </div>
        <Field label="Instagram handle" name="instagram" defaultValue={s.instagram} placeholder="@yourstudio" />
        <Button>Save settings</Button>
      </form>
    </>
  );
}
