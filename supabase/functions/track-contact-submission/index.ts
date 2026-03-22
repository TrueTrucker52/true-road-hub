import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALLOWED_SUBMISSION_TYPES = new Set(["general", "brand_deal"]);
const ALLOWED_BUDGET_TIERS = new Set(["Under $1,000", "$1,000 - $5,000", "$5,000 - $10,000", "Over $10,000"]);

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
    const submissionType = typeof body?.submissionType === "string" ? body.submissionType.toLowerCase() : "";
    const budgetTier = typeof body?.budgetTier === "string" ? body.budgetTier : null;
    const pagePath = typeof body?.pagePath === "string" ? body.pagePath : "";
    const referrer = typeof body?.referrer === "string" ? body.referrer : null;
    const userAgent = typeof body?.userAgent === "string" ? body.userAgent : null;

    if (
      !ALLOWED_SUBMISSION_TYPES.has(submissionType)
      || !pagePath
      || (budgetTier !== null && !ALLOWED_BUDGET_TIERS.has(budgetTier))
      || (submissionType !== "brand_deal" && budgetTier !== null)
    ) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase.from("contact_form_submissions").insert({
      submission_type: submissionType,
      budget_tier: submissionType === "brand_deal" ? budgetTier : null,
      page_path: pagePath,
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
    const message = error instanceof Error ? error.message : "Unknown contact tracking error";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});