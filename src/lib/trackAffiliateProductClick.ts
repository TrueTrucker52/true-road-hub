import { supabase } from "@/integrations/supabase/client";
import { getReferralPlatform, getReferralSessionId } from "@/lib/referral";

export type AffiliateProductClickPlacement = "card" | "detail_dialog";

type TrackAffiliateProductClickParams = {
  affiliateUrl: string;
  categoryId: string;
  categoryTitle: string;
  placement: AffiliateProductClickPlacement;
  productName: string;
  productSlug: string;
  sectionId: string;
  sectionTitle: string;
};

export const trackAffiliateProductClick = async ({
  affiliateUrl,
  categoryId,
  categoryTitle,
  placement,
  productName,
  productSlug,
  sectionId,
  sectionTitle,
}: TrackAffiliateProductClickParams) => {
  if (typeof window === "undefined") return affiliateUrl;

  const sessionId = getReferralSessionId();
  if (!sessionId) return affiliateUrl;

  try {
    await supabase.functions.invoke("track-affiliate-product-click", {
      body: {
        categoryId,
        categoryTitle,
        pagePath: `${window.location.pathname}${window.location.search}`,
        placement,
        platform: getReferralPlatform() ?? "direct",
        productName,
        productSlug,
        sectionId,
        sectionTitle,
        referrer: document.referrer || null,
        sessionId,
        targetUrl: affiliateUrl,
        userAgent: navigator.userAgent,
      },
    });
  } catch {
    // no-op: tracking should never block navigation
  }

  return affiliateUrl;
};