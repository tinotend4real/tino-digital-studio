import { PageHeader } from "@/components/ui";
import { NewClientForm } from "./client-form";

export default function NewClient() {
  return (
    <>
      <PageHeader title="Add client" subtitle="Creates the client and their login together." />
      <NewClientForm />
    </>
  );
}
