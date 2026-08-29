-- NEW GAMA: AUTH + OWNER ORDERS FIX
-- Run once in Supabase SQL Editor.

-- 1) Profiles table must be readable by the logged-in user for role checking.
alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- 2) Orders remain protected: only role=owner can read all orders.
alter table public.new_gama_orders enable row level security;

drop policy if exists "Owner can read all orders" on public.new_gama_orders;
create policy "Owner can read all orders"
on public.new_gama_orders
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and lower(p.role) = 'owner'
  )
);

-- 3) Check which users have which role.
select p.id, u.email, p.full_name, p.role
from public.profiles p
left join auth.users u on u.id = p.id
order by p.created_at desc;

-- If your shop owner is NOT owner, copy the real UUID from the query above:
-- update public.profiles set role='owner'
-- where id='PASTE_REAL_OWNER_UUID_HERE';
