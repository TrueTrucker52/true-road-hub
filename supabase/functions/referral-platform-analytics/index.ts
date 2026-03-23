import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const allowedDays = new Set([7, 30, 90]);
const platforms = ["youtube", "tiktok", "facebook", "instagram"] as const;
const placements = ["hero", "navbar", "gear", "footer", "unknown"] as const;
const mediaKitPlacements = ["brand_deals"] as const;
const budgetTiers = ["Under $1,000", "$1,000 - $5,000", "$5,000 - $10,000", "Over $10,000"] as const;
const affiliatePlatforms = ["youtube", "tiktok", "facebook", "instagram", "direct"] as const;
const affiliatePlacements = ["card", "detail_dialog"] as const;

type Platform = (typeof platforms)[number];
type Placement = (typeof placements)[number];
type MediaKitPlacement = (typeof mediaKitPlacements)[number];
type BudgetTier = (typeof budgetTiers)[number];
type AffiliatePlatform = (typeof affiliatePlatforms)[number];
type AffiliatePlacement = (typeof affiliatePlacements)[number];

type DailyCounts = Record<Platform, number>;
type PlacementDailyCounts = Record<Placement, number>;

const createBudgetTierCounts = () =>
  Object.fromEntries(budgetTiers.map((tier) => [tier, 0])) as Record<BudgetTier, number>;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Server configuration missing" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const token = authHeader.replace("Bearer ", "");
  const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);

  if (claimsError || !claimsData?.claims?.sub) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: isAdmin, error: roleError } = await adminClient.rpc("has_role", {
    _user_id: claimsData.claims.sub,
    _role: "admin",
  });

  if (roleError || !isAdmin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const requestedDays = Number(body?.days ?? 30);
    const comparePrevious = Boolean(body?.comparePrevious);
    const requestedAffiliateSectionId = typeof body?.affiliateSectionId === "string" && body.affiliateSectionId !== "all"
      ? body.affiliateSectionId
      : null;
    const days = allowedDays.has(requestedDays) ? requestedDays : 30;
    const startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() - (days - 1));
    startDate.setUTCHours(0, 0, 0, 0);
    const previousStartDate = new Date(startDate);
    previousStartDate.setUTCDate(previousStartDate.getUTCDate() - days);
    const previousEndDate = new Date(startDate);
    previousEndDate.setUTCMilliseconds(previousEndDate.getUTCMilliseconds() - 1);

    const { data: impressionRows, error: impressionsError } = await adminClient
      .from("referral_label_impressions")
      .select("platform, created_at")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true });

    if (impressionsError) {
      throw new Error(impressionsError.message);
    }

    const { data: clickRows, error: clicksError } = await adminClient
      .from("referral_ifta_clicks")
      .select("platform, clicked_at, placement")
      .gte("clicked_at", startDate.toISOString())
      .order("clicked_at", { ascending: true });

    if (clicksError) {
      throw new Error(clicksError.message);
    }

    const { data: previousClickRows, error: previousClicksError } = comparePrevious
      ? await adminClient
          .from("referral_ifta_clicks")
          .select("placement")
          .gte("clicked_at", previousStartDate.toISOString())
          .lte("clicked_at", previousEndDate.toISOString())
      : { data: [], error: null };

    const { data: affiliateClickRows, error: affiliateClicksError } = await adminClient
      .from("affiliate_product_clicks")
      .select("product_slug, product_name, category_id, category_title, section_id, section_title, platform, placement, target_url, created_at")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true });

    const { data: previousAffiliateClickRows, error: previousAffiliateClicksError } = comparePrevious
      ? await adminClient
          .from("affiliate_product_clicks")
          .select("product_slug, section_id")
          .gte("created_at", previousStartDate.toISOString())
          .lte("created_at", previousEndDate.toISOString())
      : { data: [], error: null };

    const { data: mediaKitRows, error: mediaKitError } = await adminClient
      .from("media_kit_downloads")
      .select("platform, placement, downloaded_at")
      .gte("downloaded_at", startDate.toISOString())
      .order("downloaded_at", { ascending: true });

    const { data: contactSubmissionRows, error: contactSubmissionsError } = await adminClient
      .from("contact_form_submissions")
      .select("submission_type, budget_tier, platform, created_at")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true });

    const { data: previousMediaKitRows, error: previousMediaKitError } = comparePrevious
      ? await adminClient
          .from("media_kit_downloads")
          .select("platform")
          .gte("downloaded_at", previousStartDate.toISOString())
          .lte("downloaded_at", previousEndDate.toISOString())
      : { data: [], error: null };

    const { data: previousContactSubmissionRows, error: previousContactSubmissionsError } = comparePrevious
      ? await adminClient
          .from("contact_form_submissions")
          .select("submission_type, platform")
          .gte("created_at", previousStartDate.toISOString())
          .lte("created_at", previousEndDate.toISOString())
      : { data: [], error: null };

    if (mediaKitError) {
      throw new Error(mediaKitError.message);
    }

    if (contactSubmissionsError) {
      throw new Error(contactSubmissionsError.message);
    }

    if (previousMediaKitError) {
      throw new Error(previousMediaKitError.message);
    }

    if (previousContactSubmissionsError) {
      throw new Error(previousContactSubmissionsError.message);
    }

    if (previousClicksError) {
      throw new Error(previousClicksError.message);
    }

    if (affiliateClicksError) {
      throw new Error(affiliateClicksError.message);
    }

    if (previousAffiliateClicksError) {
      throw new Error(previousAffiliateClicksError.message);
    }

    const impressionByDate = new Map<string, DailyCounts>();
    const clickByDate = new Map<string, DailyCounts>();
    const mediaKitByDate = new Map<string, Record<Platform | "direct", number>>();
    const placementTrendByDate = new Map<string, PlacementDailyCounts>();
    const sponsorInquiryByDate = new Map<string, Record<Platform | "direct", number>>();
    const impressionTotals = Object.fromEntries(platforms.map((platform) => [platform, 0])) as DailyCounts;
    const clickTotals = Object.fromEntries(platforms.map((platform) => [platform, 0])) as DailyCounts;
    const placementTotals = Object.fromEntries(placements.map((placement) => [placement, 0])) as Record<Placement, number>;
    const previousPlacementTotals = Object.fromEntries(placements.map((placement) => [placement, 0])) as Record<Placement, number>;
    const placementByPlatform = Object.fromEntries(
      placements.map((placement) => [placement, Object.fromEntries(platforms.map((platform) => [platform, 0]))]),
    ) as Record<Placement, DailyCounts>;
    const mediaKitPlacementTotals = Object.fromEntries(
      mediaKitPlacements.map((placement) => [placement, 0]),
    ) as Record<MediaKitPlacement, number>;
    const contactSubmissionTotals = {
      general: 0,
      brand_deal: 0,
    };
    const budgetTierTotals = Object.fromEntries(
      budgetTiers.map((tier) => [tier, 0]),
    ) as Record<BudgetTier, number>;
    const sponsorConversionBySource = {
      youtube: { downloads: 0, inquiries: 0 },
      tiktok: { downloads: 0, inquiries: 0 },
      facebook: { downloads: 0, inquiries: 0 },
      instagram: { downloads: 0, inquiries: 0 },
      direct: { downloads: 0, inquiries: 0 },
    };
    const sponsorBudgetBySource = {
      youtube: createBudgetTierCounts(),
      tiktok: createBudgetTierCounts(),
      facebook: createBudgetTierCounts(),
      instagram: createBudgetTierCounts(),
      direct: createBudgetTierCounts(),
    };
    const previousSponsorConversionBySource = {
      youtube: { downloads: 0, inquiries: 0 },
      tiktok: { downloads: 0, inquiries: 0 },
      facebook: { downloads: 0, inquiries: 0 },
      instagram: { downloads: 0, inquiries: 0 },
      direct: { downloads: 0, inquiries: 0 },
    };
    const mediaKitTotals = {
      youtube: 0,
      tiktok: 0,
      facebook: 0,
      instagram: 0,
      direct: 0,
    };
    const affiliateClickTotalsByPlatform = Object.fromEntries(
      affiliatePlatforms.map((platform) => [platform, 0]),
    ) as Record<AffiliatePlatform, number>;
    const affiliatePlacementTotals = Object.fromEntries(
      affiliatePlacements.map((placement) => [placement, 0]),
    ) as Record<AffiliatePlacement, number>;
    const affiliateProductTotals = new Map<string, {
      productSlug: string;
      productName: string;
      categoryId: string;
      categoryTitle: string;
      clicks: number;
    }>();
    const previousAffiliateProductTotals = new Map<string, number>();
    const affiliateCategoryTotals = new Map<string, {
      categoryId: string;
      categoryTitle: string;
      clicks: number;
    }>();
    const affiliateSectionTotals = new Map<string, {
      sectionId: string;
      sectionTitle: string;
      clicks: number;
    }>();
    const recentAffiliateClicks: Array<{
      createdAt: string;
      placement: AffiliatePlacement;
      productName: string;
      productSlug: string;
      sectionId: string;
      sectionTitle: string;
      targetUrl: string;
    }> = [];

    const availableAffiliateSections = new Map<string, {
      sectionId: string;
      sectionTitle: string;
      clicks: number;
    }>();

    for (let offset = 0; offset < days; offset += 1) {
      const current = new Date(startDate);
      current.setUTCDate(startDate.getUTCDate() + offset);
      const key = current.toISOString().slice(0, 10);
      impressionByDate.set(key, { youtube: 0, tiktok: 0, facebook: 0, instagram: 0 });
      clickByDate.set(key, { youtube: 0, tiktok: 0, facebook: 0, instagram: 0 });
      mediaKitByDate.set(key, { youtube: 0, tiktok: 0, facebook: 0, instagram: 0, direct: 0 });
      placementTrendByDate.set(key, { hero: 0, navbar: 0, gear: 0, footer: 0, unknown: 0 });
      sponsorInquiryByDate.set(key, { youtube: 0, tiktok: 0, facebook: 0, instagram: 0, direct: 0 });
    }

    for (const row of impressionRows ?? []) {
      const platform = row.platform as Platform;
      if (!platforms.includes(platform)) continue;

      const key = row.created_at.slice(0, 10);
      const current = impressionByDate.get(key);
      if (!current) continue;

      current[platform] += 1;
      impressionTotals[platform] += 1;
    }

    for (const row of clickRows ?? []) {
      const platform = row.platform as Platform;
      if (!platforms.includes(platform)) continue;

      const placement = (row.placement as Placement | null) ?? "unknown";

      const key = row.clicked_at.slice(0, 10);
      const current = clickByDate.get(key);
      if (!current) continue;

      current[platform] += 1;
      clickTotals[platform] += 1;
      if (placements.includes(placement)) {
        placementTotals[placement] += 1;
        placementByPlatform[placement][platform] += 1;
        const placementTrend = placementTrendByDate.get(key);
        if (placementTrend) {
          placementTrend[placement] += 1;
        }
      }
    }

    for (const row of previousClickRows ?? []) {
      const placement = (row.placement as Placement | null) ?? "unknown";
      if (placements.includes(placement)) {
        previousPlacementTotals[placement] += 1;
      }
    }

    for (const row of affiliateClickRows ?? []) {
      const availableSection = availableAffiliateSections.get(row.section_id) ?? {
        sectionId: row.section_id,
        sectionTitle: row.section_title,
        clicks: 0,
      };
      availableSection.clicks += 1;
      availableAffiliateSections.set(row.section_id, availableSection);

      if (requestedAffiliateSectionId && row.section_id !== requestedAffiliateSectionId) continue;

      const platform = affiliatePlatforms.includes(row.platform as AffiliatePlatform)
        ? (row.platform as AffiliatePlatform)
        : "direct";
      const placement = affiliatePlacements.includes(row.placement as AffiliatePlacement)
        ? (row.placement as AffiliatePlacement)
        : "card";

      affiliateClickTotalsByPlatform[platform] += 1;
      affiliatePlacementTotals[placement] += 1;

      const product = affiliateProductTotals.get(row.product_slug) ?? {
        productSlug: row.product_slug,
        productName: row.product_name,
        categoryId: row.category_id,
        categoryTitle: row.category_title,
        clicks: 0,
      };
      product.clicks += 1;
      affiliateProductTotals.set(row.product_slug, product);

      const category = affiliateCategoryTotals.get(row.category_id) ?? {
        categoryId: row.category_id,
        categoryTitle: row.category_title,
        clicks: 0,
      };
      category.clicks += 1;
      affiliateCategoryTotals.set(row.category_id, category);

      const section = affiliateSectionTotals.get(row.section_id) ?? {
        sectionId: row.section_id,
        sectionTitle: row.section_title,
        clicks: 0,
      };
      section.clicks += 1;
      affiliateSectionTotals.set(row.section_id, section);

      recentAffiliateClicks.push({
        createdAt: row.created_at,
        placement,
        productName: row.product_name,
        productSlug: row.product_slug,
        sectionId: row.section_id,
        sectionTitle: row.section_title,
        targetUrl: row.target_url,
      });
    }

    for (const row of previousAffiliateClickRows ?? []) {
      if (requestedAffiliateSectionId && row.section_id !== requestedAffiliateSectionId) continue;
      previousAffiliateProductTotals.set(row.product_slug, (previousAffiliateProductTotals.get(row.product_slug) ?? 0) + 1);
    }

    for (const row of mediaKitRows ?? []) {
      const platform = row.platform === "direct" ? "direct" : (row.platform as Platform);
      if (![...platforms, "direct"].includes(platform)) continue;

      const placement = row.placement as MediaKitPlacement;

      const key = row.downloaded_at.slice(0, 10);
      const current = mediaKitByDate.get(key);
      if (!current) continue;

      current[platform] += 1;
      mediaKitTotals[platform] += 1;
      sponsorConversionBySource[platform].downloads += 1;

      if (mediaKitPlacements.includes(placement)) {
        mediaKitPlacementTotals[placement] += 1;
      }
    }

    for (const row of contactSubmissionRows ?? []) {
      const submissionType = row.submission_type === "brand_deal" ? "brand_deal" : "general";
      contactSubmissionTotals[submissionType] += 1;

      if (submissionType === "brand_deal" && row.budget_tier && budgetTiers.includes(row.budget_tier as BudgetTier)) {
        budgetTierTotals[row.budget_tier as BudgetTier] += 1;
      }

      if (submissionType === "brand_deal") {
        const platform = row.platform === "youtube" || row.platform === "tiktok" || row.platform === "facebook" || row.platform === "instagram"
          ? row.platform
          : "direct";
        sponsorConversionBySource[platform].inquiries += 1;

        if (row.budget_tier && budgetTiers.includes(row.budget_tier as BudgetTier)) {
          sponsorBudgetBySource[platform][row.budget_tier as BudgetTier] += 1;
        }

        const key = row.created_at.slice(0, 10);
        const current = sponsorInquiryByDate.get(key);
        if (current) {
          current[platform] += 1;
        }
      }
    }

    for (const row of previousMediaKitRows ?? []) {
      const platform = row.platform === "youtube" || row.platform === "tiktok" || row.platform === "facebook" || row.platform === "instagram"
        ? row.platform
        : "direct";
      previousSponsorConversionBySource[platform].downloads += 1;
    }

    for (const row of previousContactSubmissionRows ?? []) {
      if (row.submission_type !== "brand_deal") continue;

      const platform = row.platform === "youtube" || row.platform === "tiktok" || row.platform === "facebook" || row.platform === "instagram"
        ? row.platform
        : "direct";
      previousSponsorConversionBySource[platform].inquiries += 1;
    }

    const sponsorInquiryCount = contactSubmissionTotals.brand_deal;
    const sponsorConversionRate = Object.values(mediaKitTotals).reduce((sum, value) => sum + value, 0) === 0
      ? 0
      : sponsorInquiryCount / Object.values(mediaKitTotals).reduce((sum, value) => sum + value, 0);
    const previousMediaKitDownloadCount = (previousMediaKitRows ?? []).length;
    const previousBrandDealSubmissionCount = (previousContactSubmissionRows ?? []).filter(
      (row) => row.submission_type === "brand_deal",
    ).length;
    const previousSponsorConversionRate = previousMediaKitDownloadCount === 0
      ? 0
      : previousBrandDealSubmissionCount / previousMediaKitDownloadCount;
    const sponsorConversionDelta = sponsorConversionRate - previousSponsorConversionRate;
    const sponsorConversionDeltaPercent = previousSponsorConversionRate === 0
      ? (sponsorConversionRate > 0 ? 1 : 0)
      : sponsorConversionDelta / previousSponsorConversionRate;

    const series = [...impressionByDate.entries()].map(([date, impressionCounts]) => {
      const clickCounts = clickByDate.get(date) ?? { youtube: 0, tiktok: 0, facebook: 0, instagram: 0 };

      return {
      date: new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        ...impressionCounts,
        youtubeClicks: clickCounts.youtube,
        tiktokClicks: clickCounts.tiktok,
        facebookClicks: clickCounts.facebook,
        instagramClicks: clickCounts.instagram,
      };
    });

    const mediaKitSeries = [...mediaKitByDate.entries()].map(([date, counts]) => ({
      date: new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      ...counts,
    }));

    const placementSeries = [...placementTrendByDate.entries()].map(([date, placementCounts]) => ({
      date: new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      ...placementCounts,
    }));

    const sponsorInquirySeries = [...sponsorInquiryByDate.entries()].map(([date, counts]) => ({
      date: new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      ...counts,
    }));

    const response = {
      days,
      totalImpressions: Object.values(impressionTotals).reduce((sum, value) => sum + value, 0),
      totalClicks: Object.values(clickTotals).reduce((sum, value) => sum + value, 0),
      totalAffiliateProductClicks: [...affiliateProductTotals.values()].reduce((sum, item) => sum + item.clicks, 0),
      totalMediaKitDownloads: Object.values(mediaKitTotals).reduce((sum, value) => sum + value, 0),
      totalContactSubmissions: contactSubmissionTotals.general + contactSubmissionTotals.brand_deal,
      totalBrandDealSubmissions: sponsorInquiryCount,
      sponsorConversionRate,
      previousMediaKitDownloads: previousMediaKitDownloadCount,
      previousBrandDealSubmissions: previousBrandDealSubmissionCount,
      previousSponsorConversionRate,
      sponsorConversionDelta,
      sponsorConversionDeltaPercent,
      totals: platforms.map((platform) => ({
        platform,
        impressions: impressionTotals[platform],
        clicks: clickTotals[platform],
        conversionRate: impressionTotals[platform] === 0 ? 0 : clickTotals[platform] / impressionTotals[platform],
      })),
      mediaKitTotals: ["youtube", "tiktok", "facebook", "instagram", "direct"].map((platform) => ({
        platform,
        downloads: mediaKitTotals[platform as keyof typeof mediaKitTotals],
      })),
      mediaKitPlacementTotals: mediaKitPlacements.map((placement) => ({
        placement,
        downloads: mediaKitPlacementTotals[placement],
      })),
      activeAffiliateSectionId: requestedAffiliateSectionId,
      availableAffiliateSections: [...availableAffiliateSections.values()].sort(
        (a, b) => b.clicks - a.clicks || a.sectionTitle.localeCompare(b.sectionTitle),
      ),
      affiliatePlatformTotals: affiliatePlatforms.map((platform) => ({
        platform,
        clicks: affiliateClickTotalsByPlatform[platform],
      })),
      affiliatePlacementTotals: affiliatePlacements.map((placement) => ({
        placement,
        clicks: affiliatePlacementTotals[placement],
      })),
      affiliateCategoryTotals: [...affiliateCategoryTotals.values()].sort(
        (a, b) => b.clicks - a.clicks || a.categoryTitle.localeCompare(b.categoryTitle),
      ),
      affiliateSectionTotals: [...affiliateSectionTotals.values()].sort(
        (a, b) => b.clicks - a.clicks || a.sectionTitle.localeCompare(b.sectionTitle),
      ),
      recentAffiliateClicks: [...recentAffiliateClicks]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 12),
      affiliateProductTotals: [...affiliateProductTotals.values()]
        .map((item) => {
          const previousClicks = previousAffiliateProductTotals.get(item.productSlug) ?? 0;
          const delta = item.clicks - previousClicks;

          return {
            ...item,
            previousClicks,
            delta,
            deltaPercent: previousClicks === 0 ? (item.clicks > 0 ? 1 : 0) : delta / previousClicks,
          };
        })
        .sort((a, b) => b.clicks - a.clicks || a.productName.localeCompare(b.productName)),
      contactSubmissionTotals: [
        { submissionType: "general", submissions: contactSubmissionTotals.general },
        { submissionType: "brand_deal", submissions: contactSubmissionTotals.brand_deal },
      ],
      budgetTierTotals: budgetTiers.map((tier) => ({
        budgetTier: tier,
        inquiries: budgetTierTotals[tier],
      })),
      sponsorConversionBySource: ["youtube", "tiktok", "facebook", "instagram", "direct"].map((platform) => {
        const current = sponsorConversionBySource[platform as keyof typeof sponsorConversionBySource];
        const previous = previousSponsorConversionBySource[platform as keyof typeof previousSponsorConversionBySource];
        const conversionRate = current.downloads === 0 ? 0 : current.inquiries / current.downloads;
        const previousConversionRate = previous.downloads === 0 ? 0 : previous.inquiries / previous.downloads;
        const delta = conversionRate - previousConversionRate;

        return {
          platform,
          downloads: current.downloads,
          inquiries: current.inquiries,
          budgetBreakdown: budgetTiers.map((tier) => ({
            budgetTier: tier,
            inquiries: sponsorBudgetBySource[platform as keyof typeof sponsorBudgetBySource][tier],
          })),
          conversionRate,
          previousDownloads: previous.downloads,
          previousInquiries: previous.inquiries,
          previousConversionRate,
          delta,
          deltaPercent: previousConversionRate === 0 ? (conversionRate > 0 ? 1 : 0) : delta / previousConversionRate,
        };
      }),
      placementTotals: placements.map((placement) => ({ placement, clicks: placementTotals[placement] })),
      placementComparison: placements.map((placement) => {
        const current = placementTotals[placement];
        const previous = previousPlacementTotals[placement];
        const delta = current - previous;

        return {
          placement,
          current,
          previous,
          delta,
          deltaPercent: previous === 0 ? (current > 0 ? 1 : 0) : delta / previous,
        };
      }),
      placementByPlatform: placements.map((placement) => ({
        placement,
        youtube: placementByPlatform[placement].youtube,
        tiktok: placementByPlatform[placement].tiktok,
        facebook: placementByPlatform[placement].facebook,
        instagram: placementByPlatform[placement].instagram,
      })),
      series,
      mediaKitSeries,
      placementSeries,
      sponsorInquirySeries,
      comparePrevious,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown analytics error";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});