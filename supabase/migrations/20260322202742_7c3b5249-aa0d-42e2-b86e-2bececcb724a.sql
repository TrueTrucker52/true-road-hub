ALTER TABLE public.contact_form_submissions
ADD COLUMN budget_tier TEXT;

ALTER TABLE public.contact_form_submissions
ADD CONSTRAINT contact_form_submissions_budget_tier_check
CHECK (
  budget_tier IS NULL
  OR budget_tier IN ('Under $1,000', '$1,000 - $5,000', '$5,000 - $10,000', 'Over $10,000')
);