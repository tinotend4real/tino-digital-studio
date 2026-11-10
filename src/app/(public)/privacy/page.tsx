import type { Metadata } from "next";
import { getSettings } from "@/lib/db";

export const metadata: Metadata = { title: "Privacy Policy" };

// TEMPLATE: based on how this site works. Have it reviewed against your real practices
// (and a legal professional if you can) before you rely on it.
export default async function PrivacyPage() {
  const s = await getSettings();

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-6 py-14 text-slate-700">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Privacy Policy</h1>
      <p className="text-sm text-slate-500">Last updated: [add date]</p>

      <p>
        This policy explains how {s.siteName} ("we", "us") collects and uses personal information when you use this website. We are
        the data controller. You can contact us at {s.contactEmail || "[add contact email]"}.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-slate-900">What we collect</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Enquiries:</strong> your name, email address, optional phone number, the service you are interested in, and your message,
          when you use the contact form.
        </li>
        <li>
          <strong>Client accounts:</strong> name, business name, email address, phone number, a hashed password, and information about your
          projects, invoices and support tickets.
        </li>
        <li>
          <strong>Technical data:</strong> a session cookie that keeps you logged in (see our Cookie Policy). Our hosting provider may keep
          standard server logs, such as IP address and pages requested.
        </li>
      </ul>

      <h2 className="pt-4 text-xl font-semibold text-slate-900">How we use it</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>To reply to your enquiry and provide a quote (legitimate interests, and steps you ask us to take before a contract).</li>
        <li>To deliver and manage services you have bought, including invoicing and support (contract).</li>
        <li>To keep records for accounting and legal purposes (legal obligation).</li>
        <li>To keep the site secure (legitimate interests).</li>
      </ul>
      <p>We do not sell your personal information and we do not use it for automated decision-making.</p>

      <h2 className="pt-4 text-xl font-semibold text-slate-900">Who we share it with</h2>
      <p>
        Only with service providers that help us run the site and business, such as our hosting and database providers and our email
        provider, and where the law requires it. List your actual providers here: [add providers].
      </p>

      <h2 className="pt-4 text-xl font-semibold text-slate-900">How long we keep it</h2>
      <p>
        Enquiries that do not lead to work are kept for [12] months, then deleted. Client and invoice records are kept for as long as the
        law requires (usually six years for accounting records).
      </p>

      <h2 className="pt-4 text-xl font-semibold text-slate-900">Your rights</h2>
      <p>
        Under UK data protection law you can ask to see, correct, delete or restrict the use of your information, object to its use, and
        ask for a copy in a portable format. Contact us to do this. You can also complain to the Information Commissioner's Office at
        ico.org.uk.
      </p>
    </div>
  );
}
