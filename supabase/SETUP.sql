-- ============================================================
-- Adidush - full schema for a fresh Supabase project
-- Paste this whole file into the Supabase SQL Editor and Run.
-- Consolidates the 4 original Lovable migrations.
-- ============================================================

-- 1. Business inquiries (contact form)
CREATE TABLE IF NOT EXISTS public.business_inquiries (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  email             text NOT NULL,
  phone             text,
  message           text NOT NULL,
  marketing_opt_in  boolean NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.business_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.business_inquiries;
CREATE POLICY "Anyone can submit inquiry"
  ON public.business_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 2. Workshop registrations
CREATE TABLE IF NOT EXISTS public.workshop_registrations (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  full_name           text NOT NULL,
  email               text NOT NULL,
  phone               text NOT NULL,
  workshop_id         text NOT NULL,
  workshop_title      text NOT NULL,
  workshop_date       text NOT NULL,
  participants_count  integer NOT NULL DEFAULT 1,
  total_price         numeric NOT NULL,
  payment_status      text NOT NULL DEFAULT 'pending'
);

ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert registrations" ON public.workshop_registrations;
CREATE POLICY "Anyone can insert registrations"
  ON public.workshop_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read registrations" ON public.workshop_registrations;
CREATE POLICY "Anyone can read registrations"
  ON public.workshop_registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. Workshop notifications ("notify me when a new workshop opens")
CREATE TABLE IF NOT EXISTS public.workshop_notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL,
  phone       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.workshop_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit notification request" ON public.workshop_notifications;
CREATE POLICY "Anyone can submit notification request"
  ON public.workshop_notifications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
