import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const allowedDays = new Set([7, 30, 90]);
const platforms = ["youtube", "tiktok", "facebook", "instagram"] as const;

type Platform = (typeof platforms)[number];

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
    const days = allowedDays.has(requestedDays) ? requestedDays : 30;
    const startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() - (days - 1));
    startDate.setUTCHours(0, 0, 0, 0);

    const { data, error } = await adminClient
      .from("referral_label_impressions")
      .select("platform, created_at")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    const byDate = new Map<string, Record<Platform, number>>();
    const totals = Object.fromEntries(platforms.map((platform) => [platform, 0])) as Record<Platform, number>;

    for (let offset = 0; offset < days; offset += 1) {
      const current = new Date(startDate);
      current.setUTCDate(startDate.getUTCDate() + offset);
      const key = current.toISOString().slice(0, 10);
      byDate.set(key, { youtube: 0, tiktok: 0, facebook: 0, instagram: 0 });
    }

    for (const row of data ?? []) {
      const platform = row.platform as Platform;
      if (!platforms.includes(platform)) continue;

      const key = row.created_at.slice(0, 10);
      const current = byDate.get(key);
      if (!current) continue;

      current[platform] += 1;
      totals[platform] += 1;
    }

    const series = [...byDate.entries()].map(([date, counts]) => ({
      date: new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      ...counts,
    }));

    const response = {
      days,
      totalImpressions: Object.values(totals).reduce((sum, value) => sum + value, 0),
      totals: platforms.map((platform) => ({ platform, impressions: totals[platform] })),
      series,
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