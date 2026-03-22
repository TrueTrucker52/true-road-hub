export type ReferralPlatform = "youtube" | "tiktok" | "facebook" | "instagram";

const IFTA_APP_URL = "https://true-trucker-ifta-pro.com";
const REFERRAL_PLATFORM_STORAGE_KEY = "tttv-referral-platform";

const PLATFORM_HOSTS: Record<ReferralPlatform, string[]> = {
  youtube: ["youtube.com", "youtu.be"],
  tiktok: ["tiktok.com"],
  facebook: ["facebook.com", "fb.com"],
  instagram: ["instagram.com"],
};

const DISCOUNT_CODES: Record<ReferralPlatform, string> = {
  youtube: "YOUTUBE",
  tiktok: "TIKTOK",
  facebook: "YOUTUBE",
  instagram: "INSTAGRAM",
};

const PLATFORM_LABELS: Record<ReferralPlatform, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  facebook: "Facebook",
  instagram: "Instagram",
};

const normalizePlatform = (value: string | null): ReferralPlatform | null => {
  switch (value?.toLowerCase()) {
    case "youtube":
    case "tiktok":
    case "facebook":
    case "instagram":
      return value.toLowerCase() as ReferralPlatform;
    default:
      return null;
  }
};

export const getReferralPlatform = (): ReferralPlatform | null => {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const fromParam = normalizePlatform(params.get("src") ?? params.get("source"));
  if (fromParam) {
    sessionStorage.setItem(REFERRAL_PLATFORM_STORAGE_KEY, fromParam);
    return fromParam;
  }

  const referrer = document.referrer;
  if (!referrer) {
    return normalizePlatform(sessionStorage.getItem(REFERRAL_PLATFORM_STORAGE_KEY));
  }

  try {
    const hostname = new URL(referrer).hostname.replace(/^www\./, "");

    const detectedPlatform = (Object.entries(PLATFORM_HOSTS).find(([, hosts]) =>
      hosts.some((host) => hostname === host || hostname.endsWith(`.${host}`)),
    )?.[0] as ReferralPlatform | undefined) ?? normalizePlatform(sessionStorage.getItem(REFERRAL_PLATFORM_STORAGE_KEY));

    if (detectedPlatform) {
      sessionStorage.setItem(REFERRAL_PLATFORM_STORAGE_KEY, detectedPlatform);
    }

    return detectedPlatform;
  } catch {
    return normalizePlatform(sessionStorage.getItem(REFERRAL_PLATFORM_STORAGE_KEY));
  }
};

export const getReferralDiscountCode = () => DISCOUNT_CODES[getReferralPlatform() ?? "youtube"];

export const getReferralPlatformLabel = () => PLATFORM_LABELS[getReferralPlatform() ?? "youtube"];

export const getReferralAwareIFTAUrl = () => {
  if (typeof window === "undefined") return IFTA_APP_URL;

  const url = new URL(IFTA_APP_URL);
  const platform = getReferralPlatform();

  if (platform) {
    url.searchParams.set("src", platform);
  }

  return url.toString();
};

export const getReferralSessionId = () => {
  if (typeof window === "undefined") return null;

  const sessionKey = "tttv-referral-session-id";
  const existing = sessionStorage.getItem(sessionKey);
  if (existing) return existing;

  const sessionId = crypto.randomUUID();
  sessionStorage.setItem(sessionKey, sessionId);
  return sessionId;
};