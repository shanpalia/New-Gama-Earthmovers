5-CLICK OWNER DASHBOARD FIX

Problem:
After clicking the logo 5 times and entering the Owner PIN, index.html correctly set:
sessionStorage.newGamaOwnerAuthorized = true

But owner.html ignored that authorization and forced a Supabase customer/user login.

Fixed:
- 5 logo clicks -> Owner Security PIN -> Owner Dashboard directly.
- Customer login page will NOT open after successful Owner PIN.
- A normal Supabase user with role=owner can still open the dashboard.
- Customer accounts are redirected to homepage.
- Logout clears the temporary 5-click owner authorization.

Upload BOTH index.html and owner.html from this ZIP.
