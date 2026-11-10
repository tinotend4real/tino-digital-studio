import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "FAQ" };

// Placeholder answers: edit to match how you actually work.
const faqs = [
  { q: "How long does a website take?", a: "A typical small-business site takes two to four weeks, depending on how quickly content and feedback arrive." },
  { q: "How much does it cost?", a: "See the pricing page for starting prices. You always get a fixed quote before work begins." },
  { q: "Will my site work on mobile?", a: "Yes. Every site is built mobile-first and tested on phones and tablets." },
  { q: "Do you look after the site after launch?", a: "Yes. Website maintenance covers updates, backups and small content changes." },
  { q: "Can I edit the site myself?", a: "We can set things up so you can edit key content, or you can send changes to us." },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Frequently asked questions</h1>
      <div className="mt-8 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {faqs.map((f) => (
          <details key={f.q} className="group p-5">
            <summary className="cursor-pointer list-none font-medium">{f.q}</summary>
            <p className="mt-2 text-sm text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
      <p className="mt-8 text-sm text-slate-600">
        Still have a question?{" "}
        <Link href="/contact" className="font-medium text-brand-700 hover:underline">
          Get in touch
        </Link>
        .
      </p>
    </div>
  );
}
