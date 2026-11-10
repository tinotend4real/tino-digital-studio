import type { Metadata } from "next";
import { getSettings } from "@/lib/db";

export const metadata: Metadata = { title: "Terms & Conditions" };

// TEMPLATE: a starting point only. Adjust to how you actually work and have it
// reviewed (ideally by a legal professional) before you rely on it.
export default async function TermsPage() {
  const s = await getSettings();

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-6 py-14 text-slate-700">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Terms &amp; Conditions</h1>
      <p className="text-sm text-slate-500">Last updated: [add date]</p>

      <p>
        These terms apply to services provided by {s.siteName} ("we", "us") and to your use of this website. By using the site or
        accepting a quote, you agree to them.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-slate-900">Quotes and orders</h2>
      <p>
        Quotes are valid for the period stated on the quote. Work begins once you accept the quote in writing. Anything outside the agreed
        scope will be quoted separately.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-slate-900">Payment</h2>
      <p>
        Invoices are payable by the due date shown. We may pause work or ongoing services if an invoice is overdue. Payment schedule:
        [add, e.g. 50% deposit, 50% on completion].
      </p>

      <h2 className="pt-4 text-xl font-semibold text-slate-900">Your content</h2>
      <p>
        You are responsible for the text, images and other material you give us, and you confirm you have the right to use it. We will
        not publish material that is unlawful or infringes anyone's rights.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-slate-900">Ownership</h2>
      <p>
        Once an invoice is paid in full, you own the bespoke design and content created for you. We keep ownership of our general tools,
        code libraries and know-how, and any open-source software remains under its own licence. [Adjust to your arrangement.]
      </p>

      <h2 className="pt-4 text-xl font-semibold text-slate-900">Portfolio use</h2>
      <p>We may show completed work in our portfolio unless you ask us not to in writing.</p>

      <h2 className="pt-4 text-xl font-semibold text-slate-900">Maintenance and support</h2>
      <p>
        Ongoing maintenance covers the items listed in your plan. We aim to reply to support requests within [one working day] but do not
        guarantee response or fix times.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-slate-900">Liability</h2>
      <p>
        We take reasonable care in providing our services. Nothing limits liability that cannot legally be limited. Otherwise, our total
        liability for any claim is limited to the fees you paid for the service concerned, and we are not liable for indirect or
        consequential loss such as lost profit.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-slate-900">Changes and law</h2>
      <p>
        We may update these terms; the version on this page applies. They are governed by the laws of England and Wales, and the courts of
        England and Wales have jurisdiction. Contact: {s.contactEmail || "[add contact email]"}.
      </p>
    </div>
  );
}
