"use client";

import { useActionState } from "react";
import type { Invoice } from "@prisma/client";
import { saveInvoice, type InvoiceFormState } from "@/actions/invoices";
import { Button, ButtonLink, Field, SelectField, TextArea } from "@/components/ui";

export function InvoiceForm({
  invoice,
  clients,
  defaultClientId,
}: {
  invoice?: Invoice;
  clients: { id: string; name: string }[];
  defaultClientId?: string;
}) {
  const [state, formAction] = useActionState<InvoiceFormState, FormData>(saveInvoice, undefined);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <input type="hidden" name="id" defaultValue={invoice?.id ?? ""} />
      <SelectField
        label="Client"
        name="clientId"
        defaultValue={invoice?.clientId ?? defaultClientId ?? ""}
        options={[{ value: "", label: "Choose a client…" }, ...clients.map((c) => ({ value: c.id, label: c.name }))]}
      />
      <TextArea label="Description" name="description" defaultValue={invoice?.description} rows={3} required />
      <div className="grid gap-4 md:grid-cols-3">
        <Field
          label="Amount (£)"
          name="amount"
          defaultValue={invoice ? (invoice.amountPence / 100).toFixed(2) : ""}
          placeholder="450.00"
          required
        />
        <Field
          label="Due date"
          name="dueDate"
          type="date"
          defaultValue={invoice?.dueDate ? invoice.dueDate.toISOString().slice(0, 10) : ""}
        />
        <SelectField
          label="Status"
          name="status"
          defaultValue={invoice?.status ?? "DRAFT"}
          options={[
            { value: "DRAFT", label: "Draft (hidden from client)" },
            { value: "SENT", label: "Sent" },
            { value: "PAID", label: "Paid" },
            { value: "OVERDUE", label: "Overdue" },
          ]}
        />
      </div>
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <div className="flex gap-3">
        <Button>Save invoice</Button>
        <ButtonLink href="/admin/invoices" variant="ghost">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}
