import Link from "next/link";
import { logout } from "@/actions/auth";
import { requireClient } from "@/lib/guards";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const { client } = await requireClient();

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <nav className="flex items-center gap-5 text-sm">
            <Link href="/client" className="font-semibold">
              {client.company ?? client.name}
            </Link>
            <Link href="/client" className="text-slate-600 hover:text-slate-900">
              Projects
            </Link>
            <Link href="/client/invoices" className="text-slate-600 hover:text-slate-900">
              Invoices
            </Link>
            <Link href="/client/tickets" className="text-slate-600 hover:text-slate-900">
              Support
            </Link>
          </nav>
          <form action={logout}>
            <button className="text-sm text-slate-500 hover:text-slate-900">Log out</button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
