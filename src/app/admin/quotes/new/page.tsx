import { PageHeader } from "@/components/ui";
import { QuoteForm } from "@/components/quote-form";

type Props = { searchParams: Promise<{ name?: string; email?: string }> };

export default async function NewQuote({ searchParams }: Props) {
  const { name, email } = await searchParams;

  return (
    <>
      <PageHeader title="New quote" subtitle="Add line items, then save to see the formatted quote." />
      <QuoteForm defaults={{ name, email }} />
    </>
  );
}
