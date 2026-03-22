drop view if exists public.published_youtube_videos;

create view public.published_youtube_videos
with (security_invoker = true) as
select
  id,
  youtube_video_id,
  title,
  description,
  thumbnail_url,
  video_url,
  published_at
from public.youtube_videos
where is_published = true
order by published_at desc;

grant select on public.published_youtube_videos to anon, authenticated;