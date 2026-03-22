import { supabase } from "@/integrations/supabase/client";
import { getReferralPlatform, getReferralSessionId } from "@/lib/referral";

export type MediaKitPlacement = "brand_deals";

export const trackMediaKitDownload = async (placement: MediaKitPlacement = "brand_deals") => {
  if (typeof window === "undefined") return;

  const sessionId = getReferralSessionId();
  if (!sessionId) return;

  try {
    await supabase.functions.invoke("track-media-kit-download", {
      body: {
        platform: getReferralPlatform() ?? "direct",
        pagePath: `${window.location.pathname}${window.location.search}`,
        sessionId,
        placement,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
      },
    });
  } catch {
    // no-op: tracking should never block download
  }
};