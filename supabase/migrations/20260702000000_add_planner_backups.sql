-- Cloud-sync backend for the Planner app (sawissac/planner), which shares
-- this Supabase project. One row per user; the whole app-state payload is
-- stored as jsonb, mirroring the old Google Drive appdata file-per-user model.
create table if not exists public.backups (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.backups enable row level security;

create policy "Users manage their own backup"
  on public.backups
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
