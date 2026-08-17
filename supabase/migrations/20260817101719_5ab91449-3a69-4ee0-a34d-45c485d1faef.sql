revoke all on public.affiliate_product_clicks from anon, authenticated;
revoke all on public.contact_form_submissions from anon, authenticated;
revoke all on public.course_clicks from anon, authenticated;
revoke all on public.course_waitlist_signups from anon, authenticated;
revoke all on public.media_kit_downloads from anon, authenticated;
revoke all on public.referral_ifta_clicks from anon, authenticated;
revoke all on public.referral_label_impressions from anon, authenticated;

grant select, delete on public.affiliate_product_clicks to authenticated;
grant select, delete on public.contact_form_submissions to authenticated;
grant select, delete on public.course_clicks to authenticated;
grant select, delete on public.course_waitlist_signups to authenticated;
grant select, delete on public.media_kit_downloads to authenticated;
grant select, delete on public.referral_ifta_clicks to authenticated;
grant select, delete on public.referral_label_impressions to authenticated;

grant all on public.affiliate_product_clicks to service_role;
grant all on public.contact_form_submissions to service_role;
grant all on public.course_clicks to service_role;
grant all on public.course_waitlist_signups to service_role;
grant all on public.media_kit_downloads to service_role;
grant all on public.referral_ifta_clicks to service_role;
grant all on public.referral_label_impressions to service_role;