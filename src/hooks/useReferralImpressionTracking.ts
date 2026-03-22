import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getReferralPlatform } from "@/lib/referral";

const SESSION_KEY = "tttv-referral-session-id";

const getSessionId = () => {
  if (typeof window === "undefined") return null;

  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const sessionId = crypto.randomUUID();
  sessionStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
};

export const useReferralImpressionTracking = () => {
  useEffect(() => {
    const platform = getReferralPlatform();
    if (!platform || typeof window === "undefined") return;

    const pagePath = `${window.location.pathname}${window.location.search}`;
    const dedupeKey = `tttv-referral-impression:${platform}:${pagePath}`;

    if (sessionStorage.getItem(dedupeKey)) return;

    const sessionId = getSessionId();
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