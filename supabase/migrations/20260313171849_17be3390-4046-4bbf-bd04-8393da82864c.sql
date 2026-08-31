CREATE TABLE public.workshop_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  workshop_id TEXT NOT NULL,
  workshop_title TEXT NOT NULL,
  workshop_date TEXT NOT NULL,
  participants_count INTEGER NOT NULL DEFAULT 1,
  total_price NUMERIC NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending'
);

ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert registrations"
ON public.workshop_registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can read registrations"
ON public.workshop_registrations
FOR SELECT
TO authenticated
USING (true);