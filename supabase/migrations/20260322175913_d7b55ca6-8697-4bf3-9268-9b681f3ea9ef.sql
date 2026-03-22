create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

grant select on public.user_roles to authenticated;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

create policy "Users can view their own roles"
on public.user_roles
for select
using (auth.uid() = user_id);

create table public.youtube_videos (
  id uuid primary key default gen_random_uuid(),
  youtube_video_id text not null unique,
  title text not null,
  description text,
  thumbnail_url text,
  video_url text not null,
  published_at timestamptz not null,
  is_published boolean not null default true,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index youtube_videos_published_at_idx on public.youtube_videos (published_at desc);
create index youtube_videos_is_published_idx on public.youtube_videos (is_published);

alter table public.youtube_videos enable row level security;

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_youtube_videos_updated_at
before update on public.youtube_videos
for each row
execute function public.update_updated_at_column();

create policy "Published videos are viewable by everyone"
on public.youtube_videos
for select
using (is_published = true);

create policy "Admins can insert youtube videos"
on public.youtube_videos
for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update youtube videos"
on public.youtube_videos
for update
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete youtube videos"
on public.youtube_videos
for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create or replace view public.published_youtube_videos as
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