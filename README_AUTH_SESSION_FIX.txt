IMPORTANT FIX FOR: Auth session missing!

All HTML files now use the same Supabase project URL and same public/anon key.

Do this:
1. Upload ALL files from this ZIP to GitHub (replace old files).
2. In Supabase SQL Editor run FIX_AUTH_SESSION_AND_ORDERS.sql once.
3. Open users.html.
4. Login again once with the SHOP OWNER account.
5. Go to homepage -> Bell -> Orders.

Why login again once?
Your browser may still contain an old/invalid Supabase session from the previous versions.
The new Orders page now redirects cleanly to Login instead of showing 'Auth session missing!'.

DO NOT use service_role key in any HTML file.
