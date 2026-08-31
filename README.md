# Adidush

Website for Adi Cohen - clinical dietitian, cooking workshops and
personal nutrition coaching. Hebrew, right to left.

Standalone rebuild of the original Lovable project, running on Vercel
with its own Supabase backend.

## Stack

- Vite + React 18 + TypeScript
- Tailwind + shadcn/ui
- React Router
- Supabase (Postgres + Auth), row level security on every table

## Local development

```bash
npm install
cp .env.example .env   # then fill in the Supabase values
npm run dev
```

Runs on port 8080 by default.

## Environment

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Data API → API URL, without the `/rest/v1/` suffix |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase → Settings → API Keys → publishable |
| `VITE_SUPABASE_PROJECT_ID` | the project ref inside the URL |

The publishable key is safe in the browser. The secret key is never used
by this app and must not be added to Vercel.

## Pages

`/` `/about` `/coaching` `/recipes` `/workshops` `/workshops/:id`
`/blog` `/contact`

Admin, behind Supabase Auth: `/admin/inquiries`, `/admin/registrations`.

## Database

[`supabase/SETUP.sql`](supabase/SETUP.sql) builds the whole schema on a
fresh project. Three public tables collect form submissions; anyone may
insert, only admins may read. Admin rights come from a row in
`public.admins`, which is not reachable through the API.

## Deploying

See [`DEPLOY.md`](DEPLOY.md). Pushing to `main` deploys to production.

## History

[`docs/ORIGINAL_BRIEF.md`](docs/ORIGINAL_BRIEF.md) is the original
site brief the first version was generated from.
