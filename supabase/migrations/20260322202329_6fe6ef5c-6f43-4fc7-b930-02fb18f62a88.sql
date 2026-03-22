CREATE TABLE public.contact_form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_type TEXT NOT NULL,
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT contact_form_submissions_submission_type_check CHECK (submission_type IN ('general', 'brand_deal'))
);

ALTER TABLE public.contact_form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view contact form submissions"
ON public.contact_form_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contact form submissions"
ON public.contact_form_submissions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_contact_form_submissions_created_at
ON public.contact_form_submissions (created_at DESC);

CREATE INDEX idx_contact_form_submissions_type_created_at
ON public.contact_form_submissions (submission_type, created_at DESC);