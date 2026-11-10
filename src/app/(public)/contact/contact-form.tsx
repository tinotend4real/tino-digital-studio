"use client";

import { useActionState } from "react";
import { createLead, type LeadFormState } from "@/actions/leads";
import { Button, Field, SelectField, TextArea } from "@/components/ui";

export function ContactForm({ services, selected }: { services: string[]; selected?: string }) {
  const [state, formAction] = useActionState<LeadFormState, FormData>(createLead, undefined);

  if (state?.ok) {
    return (
      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 text-green-800">
        <p className="font-medium">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Phone (optional)" name="phone" type="tel" />
        <SelectField
          label="Service interested in"
          name="service"
          defaultValue={selected ?? ""}
          options={[{ value: "", label: "Not sure yet" }, ...services.map((s) => ({ value: s, label: s }))]}
        />
      </div>
      <TextArea label="Message" name="message" rows={6} required />
      {/* Honeypot field, hidden from people, filled in by bots */}
      <div className="hidden" aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {state && !state.ok ? <p className="text-sm text-red-600">{state.message}</p> : null}
      <Button>Send enquiry</Button>
    </form>
  );
}
