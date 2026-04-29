# Streamline Lead Scanner

Compliance-first real estate lead scanner + manual CRM workflow for New Jersey markets.

## Compliance Guardrails (Built In)
- No prohibited scraping (Zillow, Realtor.com, Craigslist, Facebook, MLS).
- No captcha/login/robots.txt/ToS bypass behavior.
- No auto-sending calls, SMS, email, or DMs.
- Source tracking is required on lead creation/import.
- DNC status is enforced for outreach queue visibility.
- Outreach scripts are **manual-use only**.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase via REST (`lib/supabase.ts`)
- Internal CSV parser (`app/csv-upload/page.tsx`)

## Required Environment Variables
Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Local Setup
> Note: this container may block npm registry access. Run locally or in CI with normal registry access.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run dev server:
   ```bash
   npm run dev
   ```
3. Open: `http://localhost:3000`

## Supabase Setup
1. Create a Supabase project.
2. Run SQL migration from:
   - `supabase/migrations/001_init.sql`
3. Confirm tables exist:
   - `leads`
   - `properties`
   - `outreach_queue`
   - `do_not_contact`
   - `source_reviews`
4. Configure RLS/policies as needed for your auth model.

## What Works
- **Dashboard**: live lead metrics from Supabase.
- **Leads**: list leads from Supabase.
- **Add Lead**: insert lead with motivation scoring + source fields.
- **CSV Upload**: parse CSV, preview rows, select rows, bulk insert.
- **Source Review**: save and list approved/restricted sources.
- **Outreach Queue**: shows only leads where `dnc_status = 'clear'`.
- **Manual Script Generator**: call/SMS/email/direct-mail templates (display only).

## Vercel Deployment
1. Push repository to GitHub.
2. In Vercel, import the repo.
3. Set framework to **Next.js** (auto-detected).
4. Add env vars in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy.

Recommended build settings (defaults are fine):
- Install Command: `npm install`
- Build Command: `npm run build`
- Output: `.next`

## Safety Notes
- Do not connect prohibited scraping sources.
- Keep all outreach manual and approved by a user.
- Validate DNC before any human outreach action.
