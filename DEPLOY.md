# Adidush - deployment runbook

Standalone rebuild of `adidush-cohen.lovable.app`. Same design and
functionality, no Lovable dependency, running on Vercel with its own
Supabase project under `adi.cohen0205@gmail.com`.

---

## 1. Create the Supabase project

<https://supabase.com/dashboard/projects> → **New project**

- Name: `adidush`
- Region: **Frankfurt (eu-central-1)**
- Save the database password somewhere safe.

## 2. Create the schema

Open the SQL Editor, paste all of [`supabase/SETUP.sql`](supabase/SETUP.sql), Run.

Creates `business_inquiries`, `workshop_registrations`,
`workshop_notifications`, the `admins` table, and the `is_admin()`
function that row level security depends on.

## 3. Create Adi's admin login

Authentication → **Users** → **Add user** → *Create new user*

- Email: `adi.cohen0205@gmail.com`
- Password: pick a strong one
- Tick **Auto Confirm User**

Then back in the SQL Editor, promote her to admin:

```sql
insert into public.admins (user_id, email)
select id, email from auth.users where email = 'adi.cohen0205@gmail.com'
on conflict (user_id) do nothing;
```

Without this row she can log in but sees "אין הרשאה". Nobody can grant
themselves admin through the app - rows are only added here.

## 4. Collect the keys

Project Settings → **API Keys**. Copy the **Project URL** and the
**anon / publishable** key. Both are public and safe to put in Vercel.

Never put the `service_role` key in Vercel or in this repo. The site
does not use it.

## 5. Deploy on Vercel

<https://vercel.com/new> → import this repo → Framework preset **Vite**
(auto-detected from `vercel.json`).

Add three Environment Variables before the first deploy:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://<ref>.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | the anon key |
| `VITE_SUPABASE_PROJECT_ID` | `<ref>` |

Deploy.

## 6. Point Supabase at the live domain

Authentication → **URL Configuration** → set **Site URL** to the Vercel
domain and add it under Redirect URLs. Needed for auth sessions to
persist on the admin pages.

## 7. Smoke test

- Submit the contact form on `/contact`, confirm the row lands in
  `business_inquiries`.
- Log in at `/admin/inquiries` with Adi's email, confirm the row shows.
- Log out, reload `/admin/inquiries`, confirm it asks for login again.
- Open `/about` directly (not via a link) to confirm the SPA rewrite
  works and does not 404.

---

## What changed from the Lovable version

Design and functionality are unchanged. The differences are:

- `lovable-tagger` plugin and `.lovable/` removed.
- Placeholder meta tags ("Lovable Generated Project") replaced with real
  Hebrew SEO and Open Graph tags, self-hosted OG image.
- `public/lovable-uploads` renamed to `public/uploads`.
- `vercel.json` added so deep links do not 404 on Vercel.
- `.env` is gitignored now. It was previously committed.

### Security fixes

The Lovable build had three problems, all fixed here:

1. The admin password `adi2025` was hardcoded in `AdminInquiries.tsx`
   and shipped in the public JS bundle. Replaced with real Supabase Auth.
2. The `get-inquiries` edge function ran with the `service_role` key,
   allowed CORS from `*`, and never checked the caller. Anyone with the
   URL could dump every contact submission. The function is deleted; the
   admin page now reads the table directly and row level security
   (`is_admin()`) does the authorising.
3. `/admin/registrations` had no gate at all, and its RLS policy let any
   logged-in user read every registration. Now admin-only, same as
   inquiries.

Because the old anon key sat in a public repo and the old endpoint was
open, treat any data already in the **old** Supabase project as
potentially exposed. The new project starts clean.
