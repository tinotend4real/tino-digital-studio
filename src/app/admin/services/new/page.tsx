import { ServiceForm } from "@/components/admin-forms";
import { PageHeader } from "@/components/ui";

export default function NewService() {
  return (
    <>
      <PageHeader title="Add service" />
      <ServiceForm />
    </>
  );
}
