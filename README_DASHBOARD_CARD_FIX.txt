DASHBOARD TOTAL CARD FIX

Problem fixed:
When the dashboard was opened using 5-click Owner PIN, clicking Total Orders / Total Users could lose the owner authorization and redirect to the normal user login page.

Now:
5-click Owner PIN -> Dashboard
Dashboard Total Orders -> Orders page (owner authorization preserved)
Dashboard Total Users -> Users page (owner authorization preserved)

Replace:
- owner.html
- users.html (if present in your repository)

The owner authorization is preserved while moving between dashboard pages.
