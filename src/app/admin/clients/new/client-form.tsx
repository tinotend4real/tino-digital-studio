"use client";

import { useActionState } from "react";
import { createClient, type ClientFormState } from "@/actions/clients";
import { Button, ButtonLink, Field } from "@/components/ui";

export function NewClientForm() {
  const [state, formAction] = useActionState<ClientFormState, FormData>(createClient, undefined);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Contact name" name="name" required />
        <Field label="Business name" name="company" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Login email" name="email" type="email" required />
        <Field label="Phone" name="phone" type="tel" />
      </div>
      <Field label="Temporary password (min 8 characters)" name="password" type="password" required />
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <div className="flex gap-3">
        <Button>Create client</Button>
        <ButtonLink href="/admin/clients" variant="ghost">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}
