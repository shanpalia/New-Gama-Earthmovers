NEW GAMA EARTHMOVERS - COMPLETE ROLE LOGIN UPDATE

IMPORTANT BEFORE UPLOAD:
1) Open users.html.
2) Replace:
   REPLACE_WITH_YOUR_SUPABASE_URL
   REPLACE_WITH_YOUR_PUBLISHABLE_OR_ANON_KEY
   with your current Supabase Project URL and Publishable key (or legacy anon key).
3) Do the same replacement in orders.html and owner.html.
4) Open Supabase SQL Editor and run SUPABASE_ROLE_SETUP.sql.
5) Run:
   select id, email from auth.users order by created_at desc;
   Find your shop owner email and copy its REAL UUID.
6) Run:
   update public.profiles set role='owner' where id='YOUR_REAL_OWNER_UUID';

RESULT:
- New signup => customer
- Customer => no bell, no dashboard/orders access
- Owner => bell visible on homepage, immediately left of Parts
- Bell click => orders.html?from=current-page
- Orders Back => returns to the page where bell was clicked
