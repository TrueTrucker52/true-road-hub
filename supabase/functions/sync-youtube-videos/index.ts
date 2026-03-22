import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CHANNEL_ID = "UC7Wm_4Ks7u7w8qN5CzLytvA";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

const decodeXmlEntities = (value: string) =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(parseInt(num, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .trim();

const extractTag = (entry: string, tag: string) => {
  const match = entry.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXmlEntities(match[1]) : null;
};

const extractThumbnail = (entry: string) => {
  const match = entry.match(/<media:thumbnail[^>]*url="([^"]+)"/i);
  return match ? match[1] : null;
};

const parseFeed = (xml: string) => {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => match[1]);

  return entries
    .map((entry) => {
      const youtubeVideoId = extractTag(entry, "yt:videoId");
      const title = extractTag(entry, "title");
      const description = extractTag(entry, "media:description");
      const publishedAt = extractTag(entry, "published");

      if (!youtubeVideoId || !title || !publishedAt) return null;

      return {
        youtube_video_id: youtubeVideoId,
        title,
        description,
        thumbnail_url: extractThumbnail(entry) ?? `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`,
        video_url: `https://www.youtube.com/watch?v=${youtubeVideoId}`,
        published_at: publishedAt,
        is_published: true,
        synced_at: new Date().toISOString(),
      };
    })
    .filter((video): video is NonNullable<typeof video> => Boolean(video));
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (!supabaseUrl) {
    return new Response(JSON.stringify({ error: "SUPABASE_URL is not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceRoleKey) {
    return new Response(JSON.stringify({ error: "SUPABASE_SERVICE_ROLE_KEY is not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const feedResponse = await fetch(FEED_URL, {
      headers: { "User-Agent": "true-trucking-tv-sync" },
    });
    const xml = await feedResponse.text();

    if (!feedResponse.ok) {
      throw new Error(`YouTube feed request failed [${feedResponse.status}]: ${xml}`);
    }

    const videos = parseFeed(xml);

    if (videos.length === 0) {
      throw new Error("No videos were parsed from the YouTube feed");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase
      .from("youtube_videos")
      .upsert(videos, { onConflict: "youtube_video_id" });

    if (error) {
      throw new Error(`Database upsert failed: ${error.message}`);
    }

    return new Response(JSON.stringify({ synced: videos.length, channelId: CHANNEL_ID }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown sync error";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});