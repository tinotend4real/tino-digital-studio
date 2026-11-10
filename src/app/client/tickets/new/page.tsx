import { createTicket } from "@/actions/tickets";
import { Button, ButtonLink, Field, PageHeader, TextArea } from "@/components/ui";

export default function NewTicket() {
  return (
    <>
      <PageHeader title="New support ticket" />
      <form action={createTicket} className="max-w-xl space-y-4">
        <Field label="Subject" name="subject" required />
        <TextArea label="How can we help?" name="body" rows={6} required />
        <div className="flex gap-3">
          <Button>Send</Button>
          <ButtonLink href="/client/tickets" variant="ghost">
            Cancel
          </ButtonLink>
        </div>
      </form>
    </>
  );
}
