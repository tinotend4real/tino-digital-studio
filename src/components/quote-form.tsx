"use client";

import { useActionState } from "react";
import type { Quote, QuoteItem } from "@prisma/client";
import { saveQuote, type QuoteFormState } from "@/actions/quotes";
import { Button, ButtonLink, Field, SelectField, TextArea } from "@/components/ui";
import { QUOTE_ROWS } from "@/lib/utils";

export function QuoteForm({
  quote,
  items = [],
  defaults,
}: {
  quote?: Quote;
  items?: QuoteItem[];
  defaults?: { name?: string; email?: string };
}) {
  const [state, formAction] = useActionState<QuoteFormState, FormData>(saveQuote, undefined);

  return (
    <form action={formAction} className="max-w-3xl space-y-4">
      <input type="hidden" name="id" defaultValue={quote?.id ?? ""} />
      <Field label="Quote title" name="title" defaultValue={quote?.title} placeholder="Website for Iron Forge Gym" required />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Client name" name="clientName" defaultValue={quote?.clientName ?? defaults?.name} required />
        <Field label="Client email" name="clientEmail" type="email" defaultValue={quote?.clientEmail ?? defaults?.email} />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Line items (leave unused rows blank)</p>
        <div className="space-y-2">
          <div className="hidden grid-cols-[1fr_5rem_8rem] gap-2 text-xs text-slate-500 md:grid">
            <span>Description</span>
            <span>Qty</span>
            <span>Unit price (£)</span>
          </div>
          {Array.from({ length: QUOTE_ROWS }, (_, i) => {
            const item = items[i];
            return (
              <div key={i} className="grid gap-2 md:grid-cols-[1fr_5rem_8rem]">
                <input
                  name={`desc_${i}`}
                  defaultValue={item?.description ?? ""}
                  placeholder="Description"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                <input
                  name={`qty_${i}`}
                  type="number"
                  min={1}
                  defaultValue={item?.quantity ?? ""}
                  placeholder="1"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                <input
                  name={`price_${i}`}
                  defaultValue={item ? (item.unitPence / 100).toFixed(2) : ""}
                  placeholder="0.00"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Valid until"
          name="validUntil"
          type="date"
          defaultValue={quote?.validUntil ? quote.validUntil.toISOString().slice(0, 10) : ""}
        />
        <SelectField
          label="Status"
          name="status"
          defaultValue={quote?.status ?? "DRAFT"}
          options={[
            { value: "DRAFT", label: "Draft" },
            { value: "SENT", label: "Sent" },
            { value: "ACCEPTED", label: "Accepted" },
            { value: "DECLINED", label: "Declined" },
          ]}
        />
      </div>
      <TextArea label="Notes and terms shown on the quote" name="notes" defaultValue={quote?.notes} rows={4} />

      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <div className="flex gap-3">
        <Button>Save quote</Button>
        <ButtonLink href="/admin/quotes" variant="ghost">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}
