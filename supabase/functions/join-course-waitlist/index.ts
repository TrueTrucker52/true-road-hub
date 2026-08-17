import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALLOWED_PLATFORMS = new Set(["youtube", "tiktok", "facebook", "instagram", "direct"]);
const ALLOWED_OFFER_TYPES = new Set(["course", "service"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "Server configuration missing" }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const loadCounts = async () => {
    const { data, error } = await supabase
      .from("course_waitlist_signups")
      .select("offer_slug")
      .limit(50000);

    if (error) throw new Error(error.message);

    const byOffer: Record<string, number> = {};
    for (const row of data ?? []) {
      byOffer[row.offer_slug] = (byOffer[row.offer_slug] ?? 0) + 1;
    }

    return { total: (data ?? []).length, byOffer };
  };

  try {
    if (req.method === "GET") {
      return json(await loadCounts());
    }

    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 120) : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim().slice(0, 40) || null : null;
    const offerSlug = typeof body?.offerSlug === "string" ? body.offerSlug.slice(0, 120) : "";
    const offerName = typeof body?.offerName === "string" ? body.offerName.slice(0, 200) : "";
    const offerType = typeof body?.offerType === "string" ? body.offerType.toLowerCase() : "course";
    const price = typeof body?.price === "string" ? body.price.slice(0, 40) : null;
    const sectionId = typeof body?.sectionId === "string" ? body.sectionId.slice(0, 60) : "courses";
    const pagePath = typeof body?.pagePath === "string" ? body.pagePath.slice(0, 300) : "/courses";
    const platform = typeof body?.platform === "string" ? body.platform.toLowerCase() : "direct";
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId.slice(0, 120) : null;
    const referrer = typeof body?.referrer === "string" ? body.referrer.slice(0, 500) : null;
    const userAgent = typeof body?.userAgent === "string" ? body.userAgent.slice(0, 500) : null;

    const fieldErrors: Record<string, string> = {};
    if (name.length < 2) fieldErrors.name = "Please enter your name.";
    if (!EMAIL_RE.test(email)) fieldErrors.email = "Please enter a valid email address.";
    if (!offerSlug || !offerName) fieldErrors.offer = "Missing offer.";
    if (!ALLOWED_OFFER_TYPES.has(offerType)) fieldErrors.offer = "Invalid offer.";

    if (Object.keys(fieldErrors).length > 0) {
      return json({ error: "Invalid payload", fieldErrors }, 400);
    }

    const { data: inserted, error } = await supabase
      .from("course_waitlist_signups")
      .insert({
        name,
        email,
        phone,
        offer_slug: offerSlug,
        offer_name: offerName,
        offer_type: offerType,
        price,
        section_id: sectionId,
        page_path: pagePath,
        platform: ALLOWED_PLATFORMS.has(platform) ? platform : "direct",
        session_id: sessionId,
        referrer,
        user_agent: userAgent,
      })
      .select("id")
      .maybeSingle();

    let duplicate = false;
    if (error) {
      if (error.code === "23505") {
        duplicate = true;
      } else {
        throw new Error(error.message);
      }
    }

    // Notify the site owner if app email infrastructure is available.
    const notifyTo = Deno.env.get("WAITLIST_NOTIFICATION_EMAIL");
    if (!duplicate && notifyTo && inserted?.id) {
      try {
        const { error: emailError } = await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "waitlist-signup-notification",
            recipientEmail: notifyTo,
            idempotencyKey: `waitlist-signup-${inserted.id}`,
            templateData: { name, email, phone, offerName, price, platform, pagePath },
          },
        });
        if (!emailError) {
          await supabase
            .from("course_waitlist_signups")
            .update({ notified_at: new Date().toISOString() })
            .eq("id", inserted.id);
        }
      } catch (_) {
        // Notification failures must never block the signup.
      }
    }

    const counts = await loadCounts();

    return json({ ok: true, duplicate, ...counts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown waitlist error";
    return json({ error: message }, 500);
  }
});
