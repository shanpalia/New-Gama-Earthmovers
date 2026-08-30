-- NEW GAMA EARTHMOVERS
-- CUSTOMER ORDER INSERT FIX
-- Run once in Supabase SQL Editor.

alter table public.new_gama_orders enable row level security;

-- Remove old insert policies created during previous setup attempts.
drop policy if exists "customers can insert orders" on public.new_gama_orders;
drop policy if exists "authenticated users can create orders" on public.new_gama_orders;
drop policy if exists "Allow order insert" on public.new_gama_orders;
drop policy if exists "Allow authenticated order insert" on public.new_gama_orders;

-- Logged-in customers can create orders.
create policy "customers can insert orders"
on public.new_gama_orders
for insert
to authenticated
with check (auth.uid() is not null);
