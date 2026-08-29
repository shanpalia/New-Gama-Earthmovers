-- NEW GAMA EARTHMOVERS: OWNER-ONLY ORDERS VIEW
-- Run this in Supabase SQL Editor.

alter table public.new_gama_orders enable row level security;

-- Remove only the policy created by this setup, if it already exists.
drop policy if exists "Owner can read all orders" on public.new_gama_orders;

-- Logged-in shop owner can read all orders.
create policy "Owner can read all orders"
on public.new_gama_orders
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'owner'
  )
);

-- IMPORTANT:
-- This does NOT give customers access to all orders.
-- Customer insert/order policies already used by your checkout should remain unchanged.
