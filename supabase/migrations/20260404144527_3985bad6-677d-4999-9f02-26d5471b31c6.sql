CREATE TABLE public.workshop_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.workshop_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit notification request"
ON public.workshop_notifications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);