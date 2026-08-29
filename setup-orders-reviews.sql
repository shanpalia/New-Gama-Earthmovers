-- NEW GAMA EARTHMOVERS: ORDERS + REVIEWS TABLES
-- Run this complete script in Supabase SQL Editor.

create table if not exists public.new_gama_orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid,
  product_name text,
  part_number text,
  quantity integer not null default 1 check (quantity > 0),
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  customer_note text,
  currency text default 'INR',
  unit_price numeric default 0,
  order_status text default 'new',
  created_at timestamptz default now()
);

alter table public.new_gama_orders enable row level security;

drop policy if exists "Customers can create orders" on public.new_gama_orders;
create policy "Customers can create orders"
on public.new_gama_orders
for insert
to anon
with check (true);

-- Keep owner dashboard access controlled later through authenticated owner/admin policy.
-- Do not create public SELECT policy for orders.

create table if not exists public.new_gama_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null,
  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  review_text text not null,
  created_at timestamptz default now()
);

alter table public.new_gama_reviews enable row level security;

drop policy if exists "Public can read reviews" on public.new_gama_reviews;
create policy "Public can read reviews"
on public.new_gama_reviews
for select
to anon
using (true);

drop policy if exists "Customers can submit reviews" on public.new_gama_reviews;
create policy "Customers can submit reviews"
on public.new_gama_reviews
for insert
to anon
with check (true);
