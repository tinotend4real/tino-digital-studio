import { WebsiteForm } from "@/components/admin-forms";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/db";

export default async function NewWebsite() {
  const clients = await prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
  return (
    <>
      <PageHeader title="Add website" />
      <WebsiteForm clients={clients} />
    </>
  );
}
