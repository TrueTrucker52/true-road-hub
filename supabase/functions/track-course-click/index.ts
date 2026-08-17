import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALLOWED_PLATFORMS = new Set(["youtube", "tiktok", "facebook", "instagram", "direct"]);
const ALLOWED_ITEM_TYPES = new Set(["course", "service", "app", "book"]);

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
    const platform = typeof body?.platform === "string" ? body.platform.toLowerCase() : "direct";
    const itemType = typeof body?.itemType === "string" ? body.itemType.toLowerCase() : "course";
    const itemSlug = typeof body?.itemSlug === "string" ? body.itemSlug : "";
    const itemName = typeof body?.itemName === "string" ? body.itemName : "";
    const sectionId = typeof body?.sectionId === "string" ? body.sectionId : "";
    const price = typeof body?.price === "string" ? body.price : null;
    const pagePath = typeof body?.pagePath === "string" ? body.pagePath : "";
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId : "";
    const targetUrl = typeof body?.targetUrl === "string" ? body.targetUrl : "";
    const referrer = typeof body?.referrer === "string" ? body.referrer : null;
    const userAgent = typeof body?.userAgent === "string" ? body.userAgent : null;

    if (
      !ALLOWED_PLATFORMS.has(platform) ||
      !ALLOWED_ITEM_TYPES.has(itemType) ||
      !itemSlug ||
      !itemName ||
      !sectionId ||
      !pagePath ||
      !sessionId ||
      !targetUrl
    ) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase.from("course_clicks").insert({
      item_slug: itemSlug,
      item_name: itemName,
      item_type: itemType,
      section_id: sectionId,
      price,
      page_path: pagePath,
      platform,
      session_id: sessionId,
      target_url: targetUrl,
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
    const message = error instanceof Error ? error.message : "Unknown course click tracking error";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
