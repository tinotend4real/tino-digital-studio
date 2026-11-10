"use client";

import { useActionState } from "react";
import { updateUser, type UserFormState } from "@/actions/users";
import { Button, ButtonLink, Field } from "@/components/ui";

export function UserForm({ user }: { user: { id: string; name: string; email: string } }) {
  const [state, formAction] = useActionState<UserFormState, FormData>(updateUser, undefined);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <input type="hidden" name="id" value={user.id} />
      <Field label="Name" name="name" defaultValue={user.name} required />
      <Field label="Email" name="email" type="email" defaultValue={user.email} required />
      <Field label="New password (leave blank to keep the current one)" name="password" type="password" />
      {state ? <p className={`text-sm ${state.ok ? "text-green-700" : "text-red-600"}`}>{state.message}</p> : null}
      <div className="flex gap-3">
        <Button>Save</Button>
        <ButtonLink href="/admin/users" variant="ghost">
          Back
        </ButtonLink>
      </div>
    </form>
  );
}
