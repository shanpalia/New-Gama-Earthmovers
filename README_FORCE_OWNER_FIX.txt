FORCE FIX: 5 CLICKS -> OWNER DASHBOARD

Replace only:
1. index.html
2. owner.html

What changed:
- After correct Owner PIN, authorization is saved in BOTH sessionStorage and localStorage.
- owner.html also receives a temporary owner_access marker.
- Therefore the owner dashboard will not open users.html after the 5-click PIN flow.
- After loading, the URL is cleaned back to owner.html.
- Logout clears both owner authorization values.

Test:
Homepage -> click logo 5 times quickly -> enter correct PIN -> Owner Dashboard.
