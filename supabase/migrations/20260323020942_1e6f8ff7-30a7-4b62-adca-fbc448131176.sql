CREATE TABLE public.affiliate_product_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  product_slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  category_id TEXT NOT NULL,
  category_title TEXT NOT NULL,
  page_path TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'direct',
  placement TEXT NOT NULL DEFAULT 'gear',
  session_id TEXT,
  target_url TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT
);

ALTER TABLE public.affiliate_product_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view affiliate product clicks"
ON public.affiliate_product_clicks
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete affiliate product clicks"
ON public.affiliate_product_clicks
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_affiliate_product_clicks_created_at
ON public.affiliate_product_clicks (created_at DESC);

CREATE INDEX idx_affiliate_product_clicks_product_slug_created_at
ON public.affiliate_product_clicks (product_slug, created_at DESC);

CREATE INDEX idx_affiliate_product_clicks_category_id_created_at
ON public.affiliate_product_clicks (category_id, created_at DESC);