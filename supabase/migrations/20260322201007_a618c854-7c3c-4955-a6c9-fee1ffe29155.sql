CREATE TABLE public.media_kit_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  platform TEXT NOT NULL DEFAULT 'direct',
  placement TEXT NOT NULL DEFAULT 'brand_deals',
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.media_kit_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view media kit downloads"
ON public.media_kit_downloads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete media kit downloads"
ON public.media_kit_downloads
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_media_kit_downloads_downloaded_at
ON public.media_kit_downloads (downloaded_at DESC);

CREATE INDEX idx_media_kit_downloads_platform
ON public.media_kit_downloads (platform);

CREATE INDEX idx_media_kit_downloads_placement
ON public.media_kit_downloads (placement);