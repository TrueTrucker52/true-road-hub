create schema if not exists private;
revoke all on schema private from public;
revoke all on schema private from anon;
grant usage on schema private to authenticated, service_role;

create or replace function private.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
revoke all on function private.has_role(uuid, public.app_role) from public;
revoke all on function private.has_role(uuid, public.app_role) from anon;
grant execute on function private.has_role(uuid, public.app_role) to authenticated, service_role;

-- affiliate_product_clicks
drop policy if exists "Admins can view affiliate product clicks" on public.affiliate_product_clicks;
drop policy if exists "Admins can delete affiliate product clicks" on public.affiliate_product_clicks;
create policy "Admins can view affiliate product clicks" on public.affiliate_product_clicks for select to authenticated using (private.has_role(auth.uid(), 'admin'));
create policy "Admins can delete affiliate product clicks" on public.affiliate_product_clicks for delete to authenticated using (private.has_role(auth.uid(), 'admin'));

-- contact_form_submissions
drop policy if exists "Admins can view contact form submissions" on public.contact_form_submissions;
drop policy if exists "Admins can delete contact form submissions" on public.contact_form_submissions;
create policy "Admins can view contact form submissions" on public.contact_form_submissions for select to authenticated using (private.has_role(auth.uid(), 'admin'));
create policy "Admins can delete contact form submissions" on public.contact_form_submissions for delete to authenticated using (private.has_role(auth.uid(), 'admin'));

-- course_clicks
drop policy if exists "Admins can view course clicks" on public.course_clicks;
drop policy if exists "Admins can delete course clicks" on public.course_clicks;
create policy "Admins can view course clicks" on public.course_clicks for select to authenticated using (private.has_role(auth.uid(), 'admin'));
create policy "Admins can delete course clicks" on public.course_clicks for delete to authenticated using (private.has_role(auth.uid(), 'admin'));

-- course_waitlist_signups
drop policy if exists "Admins can view course waitlist signups" on public.course_waitlist_signups;
drop policy if exists "Admins can delete course waitlist signups" on public.course_waitlist_signups;
create policy "Admins can view course waitlist signups" on public.course_waitlist_signups for select to authenticated using (private.has_role(auth.uid(), 'admin'));
create policy "Admins can delete course waitlist signups" on public.course_waitlist_signups for delete to authenticated using (private.has_role(auth.uid(), 'admin'));

-- media_kit_downloads
drop policy if exists "Admins can view media kit downloads" on public.media_kit_downloads;
drop policy if exists "Admins can delete media kit downloads" on public.media_kit_downloads;
create policy "Admins can view media kit downloads" on public.media_kit_downloads for select to authenticated using (private.has_role(auth.uid(), 'admin'));
create policy "Admins can delete media kit downloads" on public.media_kit_downloads for delete to authenticated using (private.has_role(auth.uid(), 'admin'));

-- referral_ifta_clicks
drop policy if exists "Admins can view referral IFTA clicks" on public.referral_ifta_clicks;
drop policy if exists "Admins can delete referral IFTA clicks" on public.referral_ifta_clicks;
create policy "Admins can view referral IFTA clicks" on public.referral_ifta_clicks for select to authenticated using (private.has_role(auth.uid(), 'admin'));
create policy "Admins can delete referral IFTA clicks" on public.referral_ifta_clicks for delete to authenticated using (private.has_role(auth.uid(), 'admin'));

-- referral_label_impressions
drop policy if exists "Admins can view referral label impressions" on public.referral_label_impressions;
drop policy if exists "Admins can delete referral label impressions" on public.referral_label_impressions;
create policy "Admins can view referral label impressions" on public.referral_label_impressions for select to authenticated using (private.has_role(auth.uid(), 'admin'));
create policy "Admins can delete referral label impressions" on public.referral_label_impressions for delete to authenticated using (private.has_role(auth.uid(), 'admin'));

-- youtube_videos
drop policy if exists "Admins can insert youtube videos" on public.youtube_videos;
drop policy if exists "Admins can update youtube videos" on public.youtube_videos;
drop policy if exists "Admins can delete youtube videos" on public.youtube_videos;
create policy "Admins can insert youtube videos" on public.youtube_videos for insert to authenticated with check (private.has_role(auth.uid(), 'admin'));
create policy "Admins can update youtube videos" on public.youtube_videos for update to authenticated using (private.has_role(auth.uid(), 'admin')) with check (private.has_role(auth.uid(), 'admin'));
create policy "Admins can delete youtube videos" on public.youtube_videos for delete to authenticated using (private.has_role(auth.uid(), 'admin'));

drop function if exists public.has_role(uuid, public.app_role);

create or replace function private.bootstrap_first_admin(_user_id uuid)
returns boolean language plpgsql security definer set search_path = public as $$
declare
  admin_count integer;
begin
  if private.has_role(_user_id, 'admin') then
    return true;
  end if;

  perform pg_advisory_xact_lock(hashtext('bootstrap_first_admin'));

  select count(*)::integer into admin_count from public.user_roles where role = 'admin';

  if admin_count > 0 then
    return false;
  end if;

  insert into public.user_roles (user_id, role) values (_user_id, 'admin')
  on conflict (user_id, role) do nothing;

  return true;
end;
$$;
revoke all on function private.bootstrap_first_admin(uuid) from public;
revoke all on function private.bootstrap_first_admin(uuid) from anon;
revoke all on function private.bootstrap_first_admin(uuid) from authenticated;
grant execute on function private.bootstrap_first_admin(uuid) to service_role;

drop function if exists public.bootstrap_first_admin(uuid);