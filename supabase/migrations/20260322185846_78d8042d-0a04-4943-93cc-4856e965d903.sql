CREATE TABLE public.referral_ifta_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  page_path TEXT NOT NULL,
  session_id TEXT NOT NULL,
  target_url TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT referral_ifta_clicks_platform_check CHECK (platform IN ('youtube', 'tiktok', 'facebook', 'instagram'))
);

CREATE INDEX idx_referral_ifta_clicks_platform_clicked_at
  ON public.referral_ifta_clicks (platform, clicked_at DESC);

CREATE INDEX idx_referral_ifta_clicks_session_path_platform
  ON public.referral_ifta_clicks (session_id, page_path, platform);

ALTER TABLE public.referral_ifta_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view referral IFTA clicks"
ON public.referral_ifta_clicks
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete referral IFTA clicks"
ON public.referral_ifta_clicks
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE VIEW public.referral_platform_ifta_click_totals AS
SELECT
  platform,
  count(*)::bigint AS clicks,
  max(clicked_at) AS last_clicked_at
FROM public.referral_ifta_clicks
GROUP BY platform;