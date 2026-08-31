-- ============================================================
-- Adidush - full schema for a fresh Supabase project
-- Paste this whole file into the Supabase SQL Editor and Run.
--
-- Consolidates the 4 original Lovable migrations and adds real
-- admin authentication (the original build used a password
-- hardcoded in the browser bundle).
-- ============================================================

-- ------------------------------------------------------------
-- 0. Admin identity
-- ------------------------------------------------------------
-- Who counts as an admin. Rows are added manually (see step 5
-- in DEPLOY.md) so there is no way to self-register as one.
CREATE TABLE IF NOT EXISTS public.admins (
  user_id     uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
-- Deliberately no policies: the table is invisible through the API.
-- Only the SECURITY DEFINER function below and service_role can read it.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ------------------------------------------------------------
-- 1. Business inquiries (contact form)
-- ------------------------------------------------------------
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

-- Anyone may submit the contact form.
DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.business_inquiries;
CREATE POLICY "Anyone can submit inquiry"
  ON public.business_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins may read submissions.
DROP POLICY IF EXISTS "Admins can read inquiries" ON public.business_inquiries;
CREATE POLICY "Admins can read inquiries"
  ON public.business_inquiries
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------
-- 2. Workshop registrations
-- ------------------------------------------------------------
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

-- Replaces the original policy, which let ANY logged-in user read
-- every registration.
DROP POLICY IF EXISTS "Anyone can read registrations" ON public.workshop_registrations;
DROP POLICY IF EXISTS "Admins can read registrations" ON public.workshop_registrations;
CREATE POLICY "Admins can read registrations"
  ON public.workshop_registrations
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------
-- 3. Workshop notifications ("tell me when a new workshop opens")
-- ------------------------------------------------------------
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

DROP POLICY IF EXISTS "Admins can read notifications" ON public.workshop_notifications;
CREATE POLICY "Admins can read notifications"
  ON public.workshop_notifications
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------
-- 4. Data API grants
-- ------------------------------------------------------------
-- Explicit so the schema works whether or not "Automatically expose
-- new tables" was ticked when the project was created. Row level
-- security above is what actually restricts access; these grants only
-- make the tables visible to the API roles.
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT INSERT ON public.business_inquiries      TO anon, authenticated;
GRANT INSERT ON public.workshop_registrations  TO anon, authenticated;
GRANT INSERT ON public.workshop_notifications  TO anon, authenticated;

GRANT SELECT ON public.business_inquiries      TO authenticated;
GRANT SELECT ON public.workshop_registrations  TO authenticated;
GRANT SELECT ON public.workshop_notifications  TO authenticated;

-- public.admins must not be reachable at all. A project created with
-- "Automatically expose new tables" ticked grants the API roles access
-- to it by default, so revoke that explicitly. RLS already returns no
-- rows; this removes the table from the API surface entirely.
REVOKE ALL ON public.admins FROM anon, authenticated;
