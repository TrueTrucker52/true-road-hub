CREATE TABLE public.course_waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  offer_slug text NOT NULL,
  offer_name text NOT NULL,
  offer_type text NOT NULL DEFAULT 'course',
  price text,
  section_id text NOT NULL DEFAULT 'courses',
  page_path text NOT NULL DEFAULT '/courses',
  platform text NOT NULL DEFAULT 'direct',
  session_id text,
  referrer text,
  user_agent text,
  notified_at timestamptz
);

CREATE UNIQUE INDEX course_waitlist_signups_email_offer_key
  ON public.course_waitlist_signups (lower(email), offer_slug);
CREATE INDEX course_waitlist_signups_created_at_idx
  ON public.course_waitlist_signups (created_at DESC);

GRANT SELECT, DELETE ON public.course_waitlist_signups TO authenticated;
GRANT ALL ON public.course_waitlist_signups TO service_role;

ALTER TABLE public.course_waitlist_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view course waitlist signups"
  ON public.course_waitlist_signups FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete course waitlist signups"
  ON public.course_waitlist_signups FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));