-- Check the currently configured owner/customer profiles
select p.id, p.full_name, p.role, u.email
from public.profiles p
left join auth.users u on u.id = p.id
order by p.created_at desc;

-- If your shop owner is showing as customer, replace OWNER_UUID with the REAL UUID
-- from Supabase Authentication > Users:
-- update public.profiles set role='owner' where id='OWNER_UUID';
