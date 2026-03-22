import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getReferralPlatform, getReferralSessionId } from "@/lib/referral";

export const useReferralImpressionTracking = () => {
  useEffect(() => {
    const platform = getReferralPlatform();
    if (!platform || typeof window === "undefined") return;

    const pagePath = `${window.location.pathname}${window.location.search}`;
    const dedupeKey = `tttv-referral-impression:${platform}:${pagePath}`;

    if (sessionStorage.getItem(dedupeKey)) return;

    const sessionId = getReferralSessionId();
    if (!sessionId) return;

    sessionStorage.setItem(dedupeKey, "pending");

    void supabase.functions
      .invoke("track-referral-impression", {
        body: {
          platform,
          pagePath,
          sessionId,
          referrer: document.referrer || null,
          userAgent: navigator.userAgent,
        },
      })
      .then(({ error }) => {
        if (error) {
          sessionStorage.removeItem(dedupeKey);
          return;
        }

        sessionStorage.setItem(dedupeKey, "tracked");
      })
      .catch(() => {
        sessionStorage.removeItem(dedupeKey);
      });
  }, []);
};