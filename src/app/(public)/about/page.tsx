import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

// Placeholder copy: replace with the real story (a good job for Mia).
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">About us</h1>
      <p className="mt-4 text-lg text-slate-600">
        We're a small digital studio helping local businesses get a professional presence online.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Our story</h2>
      <p className="mt-2 text-slate-700">
        Write your company story here: why you started, who you help, and what makes your approach different.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Mission</h2>
      <p className="mt-2 text-slate-700">
        Make good web design and honest digital support accessible to small businesses.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Values</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
        <li>Clear communication and fixed quotes</li>
        <li>Fast, accessible, mobile-friendly sites</li>
        <li>Open source where we can</li>
      </ul>
    </div>
  );
}
