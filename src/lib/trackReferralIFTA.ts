import { supabase } from "@/integrations/supabase/client";
import { getReferralAwareIFTAUrl, getReferralPlatform, getReferralSessionId } from "@/lib/referral";

export const trackReferralIFTAClick = async () => {
  if (typeof window === "undefined") return getReferralAwareIFTAUrl();

  const platform = getReferralPlatform();
  if (!platform) return getReferralAwareIFTAUrl();

  const sessionId = getReferralSessionId();
  const targetUrl = getReferralAwareIFTAUrl();

  if (!sessionId) return targetUrl;

  try {
    await supabase.functions.invoke("track-referral-ifta-click", {
      body: {
        platform,
        pagePath: `${window.location.pathname}${window.location.search}`,
        sessionId,
        targetUrl,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
      },
    });
  } catch {
    // no-op: tracking should never block navigation
  }

  return targetUrl;
};