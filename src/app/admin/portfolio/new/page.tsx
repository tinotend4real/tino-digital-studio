import { PortfolioForm } from "@/components/admin-forms";
import { PageHeader } from "@/components/ui";

export default function NewProject() {
  return (
    <>
      <PageHeader title="Add project" />
      <PortfolioForm />
    </>
  );
}
