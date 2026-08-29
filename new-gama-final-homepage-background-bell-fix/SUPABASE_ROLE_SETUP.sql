-- 1. Customer/Owner profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'customer' check (role in ('owner','customer')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select to authenticated
using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert to authenticated
with check (auth.uid() = id);

-- 2. Automatically create a CUSTOMER profile after signup
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name','Customer'),
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute procedure public.handle_new_user_profile();

-- 3. Make YOUR existing owner account owner.
-- First run this to see your Auth users:
-- select id, email from auth.users order by created_at desc;

-- Then copy your owner's real UUID and replace YOUR_REAL_OWNER_UUID below:
-- update public.profiles
-- set role = 'owner'
-- where id = 'YOUR_REAL_OWNER_UUID';

-- If the profile row does not exist:
-- insert into public.profiles (id, full_name, role)
-- values ('YOUR_REAL_OWNER_UUID','New Gama Owner','owner')
-- on conflict (id) do update set role='owner';
