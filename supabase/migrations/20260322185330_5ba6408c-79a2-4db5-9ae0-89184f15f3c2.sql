CREATE TABLE public.referral_label_impressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  page_path TEXT NOT NULL,
  session_id TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT referral_label_impressions_platform_check CHECK (platform IN ('youtube', 'tiktok', 'facebook', 'instagram'))
);

CREATE INDEX idx_referral_label_impressions_platform_created_at
  ON public.referral_label_impressions (platform, created_at DESC);

CREATE INDEX idx_referral_label_impressions_session_path_platform
  ON public.referral_label_impressions (session_id, page_path, platform);

ALTER TABLE public.referral_label_impressions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view referral label impressions"
ON public.referral_label_impressions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete referral label impressions"
ON public.referral_label_impressions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE VIEW public.referral_platform_impression_totals AS
SELECT
  platform,
  count(*)::bigint AS impressions,
  max(created_at) AS last_seen_at
FROM public.referral_label_impressions
GROUP BY platform;