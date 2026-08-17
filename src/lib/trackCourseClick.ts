import { supabase } from "@/integrations/supabase/client";
import { getReferralPlatform, getReferralSessionId } from "@/lib/referral";

export type CourseClickItemType = "course" | "service" | "app" | "book";

type TrackCourseClickParams = {
  itemName: string;
  itemSlug: string;
  itemType: CourseClickItemType;
  price?: string;
  sectionId: string;
  targetUrl: string;
};

export const trackCourseClick = ({
  itemName,
  itemSlug,
  itemType,
  price,
  sectionId,
  targetUrl,
}: TrackCourseClickParams) => {
  if (typeof window === "undefined") return;

  const sessionId = getReferralSessionId();
  if (!sessionId) return;

  try {
    void supabase.functions
      .invoke("track-course-click", {
        body: {
          itemName,
          itemSlug,
          itemType,
          pagePath: `${window.location.pathname}${window.location.search}`,
          platform: getReferralPlatform() ?? "direct",
          price: price ?? null,
          referrer: document.referrer || null,
          sectionId,
          sessionId,
          targetUrl,
          userAgent: navigator.userAgent,
        },
      })
      .catch(() => {
        // no-op: tracking must never block navigation
      });
  } catch {
    // no-op
  }
};
