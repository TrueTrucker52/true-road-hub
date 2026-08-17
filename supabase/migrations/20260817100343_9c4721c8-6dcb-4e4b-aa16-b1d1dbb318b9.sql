CREATE TABLE public.course_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  item_slug TEXT NOT NULL,
  item_name TEXT NOT NULL,
  item_type TEXT NOT NULL DEFAULT 'course',
  section_id TEXT NOT NULL,
  price TEXT,
  page_path TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'direct',
  session_id TEXT,
  target_url TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT
);

GRANT SELECT, DELETE ON public.course_clicks TO authenticated;
GRANT ALL ON public.course_clicks TO service_role;

ALTER TABLE public.course_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view course clicks"
ON public.course_clicks
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete course clicks"
ON public.course_clicks
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_course_clicks_created_at ON public.course_clicks (created_at DESC);
CREATE INDEX idx_course_clicks_item_slug_created_at ON public.course_clicks (item_slug, created_at DESC);
CREATE INDEX idx_course_clicks_section_created_at ON public.course_clicks (section_id, created_at DESC);