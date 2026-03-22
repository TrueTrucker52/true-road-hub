ALTER TABLE public.referral_ifta_clicks
ADD COLUMN placement TEXT;

UPDATE public.referral_ifta_clicks
SET placement = 'unknown'
WHERE placement IS NULL;

ALTER TABLE public.referral_ifta_clicks
ALTER COLUMN placement SET NOT NULL,
ADD CONSTRAINT referral_ifta_clicks_placement_check CHECK (placement IN ('hero', 'navbar', 'gear', 'footer', 'unknown'));

CREATE INDEX idx_referral_ifta_clicks_placement_clicked_at
  ON public.referral_ifta_clicks (placement, clicked_at DESC);