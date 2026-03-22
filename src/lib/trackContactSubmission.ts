import { getReferralPlatform } from "@/lib/referral";

export type ContactSubmissionType = "general" | "brand_deal";
export type ContactSubmissionBudgetTier = "Under $1,000" | "$1,000 - $5,000" | "$5,000 - $10,000" | "Over $10,000";

export const trackContactSubmission = (
  submissionType: ContactSubmissionType,
  budgetTier?: ContactSubmissionBudgetTier,
) => {
  if (typeof window === "undefined") return;

  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-contact-submission`;
  const payload = {
    submissionType,
    budgetTier: budgetTier ?? null,
    platform: getReferralPlatform() ?? "direct",
    pagePath: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || null,
    userAgent: navigator.userAgent,
  };
  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon(url, blob)) {
      return;
    }
  }

  void fetch(url, {
    method: "POST",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body,
  }).catch(() => undefined);
};