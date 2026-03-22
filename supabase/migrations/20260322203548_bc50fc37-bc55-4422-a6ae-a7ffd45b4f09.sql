ALTER TABLE public.contact_form_submissions
ADD COLUMN platform TEXT;

ALTER TABLE public.contact_form_submissions
ADD CONSTRAINT contact_form_submissions_platform_check
CHECK (
  platform IS NULL
  OR platform IN ('youtube', 'tiktok', 'facebook', 'instagram', 'direct')
);

CREATE INDEX idx_contact_form_submissions_platform_created_at
ON public.contact_form_submissions (platform, created_at DESC);