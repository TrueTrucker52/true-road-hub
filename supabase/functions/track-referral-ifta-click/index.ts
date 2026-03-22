import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALLOWED_PLATFORMS = new Set(["youtube", "tiktok", "facebook", "instagram"]);
const ALLOWED_PLACEMENTS = new Set(["hero", "navbar", "gear", "footer", "unknown"]);

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

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Server configuration missing" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const platform = typeof body?.platform === "string" ? body.platform.toLowerCase() : "";
    const pagePath = typeof body?.pagePath === "string" ? body.pagePath : "";
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId : "";
    const targetUrl = typeof body?.targetUrl === "string" ? body.targetUrl : "";
    const placement = typeof body?.placement === "string" ? body.placement.toLowerCase() : "unknown";
    const referrer = typeof body?.referrer === "string" ? body.referrer : null;
    const userAgent = typeof body?.userAgent === "string" ? body.userAgent : null;

    if (!ALLOWED_PLATFORMS.has(platform) || !ALLOWED_PLACEMENTS.has(placement) || !pagePath || !sessionId || !targetUrl) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase.from("referral_ifta_clicks").insert({
      platform,
      page_path: pagePath,
      session_id: sessionId,
      target_url: targetUrl,
      placement,
      referrer,
      user_agent: userAgent,
    });

    if (error) {
      throw new Error(error.message);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown click tracking error";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});