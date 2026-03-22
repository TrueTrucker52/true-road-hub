export type ContactSubmissionType = "general" | "brand_deal";
export type ContactSubmissionBudgetTier = "Under $1,000" | "$1,000 - $5,000" | "$5,000 - $10,000" | "Over $10,000";

export const trackContactSubmission = (
  submissionType: ContactSubmissionType,
  budgetTier?: ContactSubmissionBudgetTier,
) => {
  if (typeof window === "undefined") return;

  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-contact-submission`;

  void fetch(url, {
    method: "POST",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({
      submissionType,
      budgetTier: budgetTier ?? null,
      pagePath: `${window.location.pathname}${window.location.search}`,
      referrer: document.referrer || null,
      userAgent: navigator.userAgent,
    }),
  }).catch(() => undefined);
};