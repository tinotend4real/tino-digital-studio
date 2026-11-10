import type { Metadata } from "next";
import { getSettings } from "@/lib/db";

export const metadata: Metadata = { title: "Cookie Policy" };

// TEMPLATE: accurate for the site as shipped (login cookie only, no analytics or ads).
// If you add analytics, embeds or marketing tools, update this page and add a consent banner.
export default async function CookiesPage() {
  const s = await getSettings();

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-6 py-14 text-slate-700">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Cookie Policy</h1>
      <p className="text-sm text-slate-500">Last updated: [add date]</p>

      <p>
        Cookies are small files a website stores in your browser. {s.siteName} uses only the cookies needed to run the site and keep
        you logged in. We do not use analytics, advertising or tracking cookies.
      </p>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Cookie</th>
              <th className="px-4 py-3 font-medium">Purpose</th>
              <th className="px-4 py-3 font-medium">Lasts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3">authjs.session-token</td>
              <td className="px-4 py-3">Keeps you logged in to the client or admin area. Only set when you log in.</td>
              <td className="px-4 py-3">Up to 30 days</td>
            </tr>
            <tr>
              <td className="px-4 py-3">authjs.csrf-token, authjs.callback-url</td>
              <td className="px-4 py-3">Security cookies used during login.</td>
              <td className="px-4 py-3">Session</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        These are strictly necessary, so they do not need your consent under UK rules. You can block cookies in your browser settings,
        but you will not be able to log in.
      </p>
      <p>Questions? Contact {s.contactEmail || "[add contact email]"}.</p>
    </div>
  );
}
