create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  duration text not null,
  icon text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.services enable row level security;

-- Policy to allow public read access
create policy "Allow public read access" on public.services for select using (true);

-- Policy to allow authenticated users (admin) full access
create policy "Allow admin full access" on public.services for all using (auth.role() = 'authenticated');
