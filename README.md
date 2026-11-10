# Tino Digital Studio

Open-source agency platform: public marketing site, admin dashboard and a lean client dashboard.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · PostgreSQL · Prisma · Auth.js (NextAuth v5) · Docker · GitHub Actions

## Run it locally

You need Node 20+ and Docker (for Postgres).

```bash
cp .env.example .env          # then set AUTH_SECRET (openssl rand -base64 32)
docker compose up -d          # starts Postgres on :5432
npm install
npx prisma migrate dev --name init
npm run db:seed               # creates your admin login + sample services and projects
npm run dev                   # http://localhost:3000
```

Log in at `/login` with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from your `.env`. **Change the password before deploying.**

## What's included

| Area | Routes |
| --- | --- |
| Public | `/`, `/about`, `/services`, `/services/[slug]`, `/portfolio`, `/portfolio/[slug]`, `/pricing`, `/blog`, `/blog/[slug]`, `/contact`, `/faq`, `/privacy`, `/terms`, `/cookies` |
| Admin (ADMIN role) | `/admin`, `/admin/services`, `/admin/portfolio`, `/admin/blog`, `/admin/leads`, `/admin/quotes`, `/admin/websites`, `/admin/clients`, `/admin/invoices`, `/admin/tickets`, `/admin/analytics`, `/admin/users`, `/admin/settings` (list, new and edit pages where they apply) |
| Client (CLIENT role) | `/login`, `/client`, `/client/projects/[id]`, `/client/invoices`, `/client/invoices/[id]`, `/client/tickets`, `/client/tickets/new`, `/client/tickets/[id]` |

How it fits together:

- **Blog:** write posts in `/admin/blog` (plain text, blank line = new paragraph). Only published posts show on `/blog`.
- **Quotes:** build a quote with up to 8 line items in `/admin/quotes/new`, or start one from a lead's page. Save, then use your browser's Print / Save as PDF on the quote page.
- **Invoices:** amounts are stored in pence. Draft invoices are hidden from clients; set one to Sent and it appears in the client's `/client/invoices`. There is no online payment yet, so mark invoices Paid by hand.
- **Analytics:** charts built from your own database (leads, invoices, websites, quotes, tickets). It doesn't track website visitors.
- **Users:** `/admin/users` lists every login and lets you change names, emails and passwords. Add clients from the Clients page.

- **Contact form** saves a `Lead`. Manage status (New, Contacted, Proposal sent, Won, Lost) in `/admin/leads`.
- **Services and portfolio** are edited in the admin and appear on the public site. Portfolio items can be marked as sample projects.
- **Clients:** create one in `/admin/clients/new`. That makes their login too. Post project updates and status changes; the client sees them in `/client`.
- **Tickets:** clients open tickets, you reply from `/admin/tickets`.
- **Website inventory** tracks every site you've built or manage.
- Access rules live in `src/auth.config.ts` (middleware) and are re-checked inside every server action and layout via `src/lib/guards.ts`. Client pages only query data for the logged-in client.

Data changes go through Server Actions in `src/actions/`, so there's no separate REST layer in V1.

## Project layout

```
prisma/            schema.prisma, seed.ts
src/auth.ts        Auth.js (credentials + bcrypt)
src/auth.config.ts edge-safe route rules and role handling
src/middleware.ts  protects /admin and /client
src/actions/       server actions (create/update/delete)
src/components/    ui.tsx (form fields, cards), admin-forms.tsx
src/app/(public)/  marketing site
src/app/admin/     admin dashboard
src/app/client/    client dashboard
```

## Before you go live

- Set a strong `AUTH_SECRET` and a real admin password.
- Replace the placeholder About and FAQ copy (`src/app/(public)/about`, `faq`).
- Remove or relabel sample portfolio projects, or keep them marked "Sample project".
- The Privacy, Terms and Cookie pages are templates. Fill in the `[bracketed]` parts, check they match what you actually do, and ideally have a legal professional review them.
- There is no rate limiting on login or the contact form yet. The form has a basic honeypot only.
- Deploy: Vercel plus a hosted Postgres (Neon, Supabase), or use the included `Dockerfile`. Run `npx prisma migrate deploy` against the production database.

## Not in V1 (planned)

Online payments, emailing quotes and invoices, file uploads, email notifications, visitor analytics, a rich-text blog editor, public API and docs, AI website generator.

## Already ran the first migration?

If you set up the earlier version of this project, the blog, invoice and quote tables are new. Run `npx prisma migrate dev --name add-blog-invoices-quotes` to add them, then `npm run db:seed` to add the sample blog post.

## Notes

This code was generated without being installed or compiled. Run `npm run typecheck` after `npm install` and fix anything it reports. A small version mismatch (especially `next-auth@5.0.0-beta`) is the most likely culprit.
