ALTER TABLE public.affiliate_product_clicks
ADD COLUMN section_id TEXT NOT NULL DEFAULT 'gear-george-recommends',
ADD COLUMN section_title TEXT NOT NULL DEFAULT 'Gear George Recommends';

CREATE INDEX idx_affiliate_product_clicks_section_id_created_at
ON public.affiliate_product_clicks (section_id, created_at DESC);