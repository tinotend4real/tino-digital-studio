import Link from "next/link";
import { getSettings } from "@/lib/db";

// Public pages read from the database, so render on request instead of at build time.
export const dynamic = "force-dynamic";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            {s.siteName}
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-slate-900">
                {n.label}
              </Link>
            ))}
            <Link href="/login" className="hover:text-slate-900">
              Log in
            </Link>
            <Link
              href="/contact"
              className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white transition hover:bg-brand-700"
            >
              Get a quote
            </Link>
          </nav>
          <Link href="/contact" className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white md:hidden">
            Contact
          </Link>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t border-slate-100 px-6 py-2 text-sm text-slate-600 md:hidden">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap">
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 text-sm text-slate-600 md:grid-cols-3">
          <div>
            <p className="font-semibold text-slate-900">{s.siteName}</p>
            <p className="mt-2">{s.tagline}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Explore</p>
            <ul className="mt-2 space-y-1">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-slate-900">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Contact</p>
            <ul className="mt-2 space-y-1">
              {s.contactEmail ? <li>{s.contactEmail}</li> : null}
              {s.phone ? <li>{s.phone}</li> : null}
              {s.location ? <li>{s.location}</li> : null}
              {s.instagram ? <li>Instagram: {s.instagram}</li> : null}
            </ul>
          </div>
        </div>
        <p className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} {s.siteName} ·{" "}
          <Link href="/privacy" className="hover:text-slate-700">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/terms" className="hover:text-slate-700">
            Terms
          </Link>{" "}
          ·{" "}
          <Link href="/cookies" className="hover:text-slate-700">
            Cookies
          </Link>
        </p>
      </footer>
    </div>
  );
}
