-- Replaces the single-JSONB-blob `backups` table (never went live — see
-- 20260702000000_add_planner_backups.sql) with a normalized schema: one row
-- per file/group/todo/user instead of one blob per account. Lets toolkits'
-- Planner bridge (src/lib/planner-bridge.ts) read/write individual todos
-- directly instead of a full read-modify-write on the whole blob.
--
-- Planner's own client (src/lib/cloud-sync-backend.ts) still does ONE call
-- per push/pull — `upsert_planner_state` / `get_planner_state` below do the
-- fan-out server-side, so the "whole local state syncs atomically" model
-- Planner's Redux store expects is unchanged; only the storage shape is.
drop table if exists public.backups;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.planner_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  icon text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.planner_groups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_id uuid not null references public.planner_files(id) on delete cascade,
  name text not null,
  position integer not null default 0
);

create table public.planner_todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_id uuid not null references public.planner_files(id) on delete cascade,
  group_id uuid references public.planner_groups(id) on delete set null,
  title text not null,
  done boolean not null default false,
  created_at timestamptz not null default now(),
  done_at timestamptz,
  completed_from timestamptz,
  completed_to timestamptz,
  priority text,
  progress text,
  assignees text[] not null default '{}',
  thought text not null default '',
  position integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Planner's assignable team members (userSlice) — distinct from auth.users.
create table public.planner_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  agenda text not null default '',
  position integer not null default 0
);

-- UI prefs (font, sidebar width, colors, filters, …) — a flat bag with no
-- query need, so this one stays jsonb. `active_file_id` gets a real column
-- since it references planner_files.
create table public.planner_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  active_file_id uuid references public.planner_files(id) on delete set null,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index planner_files_user_id_idx on public.planner_files(user_id);
create index planner_groups_user_id_idx on public.planner_groups(user_id);
create index planner_groups_file_id_idx on public.planner_groups(file_id);
create index planner_todos_user_id_idx on public.planner_todos(user_id);
create index planner_todos_file_id_idx on public.planner_todos(file_id);
create index planner_todos_group_id_idx on public.planner_todos(group_id);
create index planner_members_user_id_idx on public.planner_members(user_id);

-- ---------------------------------------------------------------------------
-- updated_at auto-refresh (default now() only fires on INSERT, not UPDATE)
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger planner_files_set_updated_at
  before update on public.planner_files
  for each row execute function public.set_updated_at();

create trigger planner_todos_set_updated_at
  before update on public.planner_todos
  for each row execute function public.set_updated_at();

create trigger planner_settings_set_updated_at
  before update on public.planner_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS — every table scoped directly by user_id (denormalized onto every row
-- rather than join-based policies: simpler policies, and the index above
-- makes the check itself trivial).
-- ---------------------------------------------------------------------------

alter table public.planner_files enable row level security;
alter table public.planner_groups enable row level security;
alter table public.planner_todos enable row level security;
alter table public.planner_members enable row level security;
alter table public.planner_settings enable row level security;

create policy "Users manage their own files"
  on public.planner_files for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own groups"
  on public.planner_groups for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own todos"
  on public.planner_todos for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own members"
  on public.planner_members for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own settings"
  on public.planner_settings for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- RPCs — Planner's client still does exactly one call per push/pull; the
-- fan-out across tables happens here instead of in application code.
-- ---------------------------------------------------------------------------

-- Replaces the caller's entire Planner state. `p_files` mirrors
-- TodosState.files (each with nested `groups`/`todos` arrays), `p_members`
-- mirrors UsersState.users, `p_settings` is the flat prefs object.
-- Delete-then-reinsert, matching Planner's existing "push whole state"
-- semantics — same tradeoff as the old blob (last push wins), just stored
-- relationally now.
create or replace function public.upsert_planner_state(
  p_files jsonb,
  p_active_file_id uuid,
  p_members jsonb,
  p_settings jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  f jsonb;
  g jsonb;
  t jsonb;
  v_file_id uuid;
  v_group_id uuid;
begin
  if v_uid is null then
    raise exception 'Not signed in';
  end if;

  delete from public.planner_files where user_id = v_uid;
  delete from public.planner_members where user_id = v_uid;

  for f in select * from jsonb_array_elements(coalesce(p_files, '[]'::jsonb))
  loop
    insert into public.planner_files (id, user_id, name, icon, position)
    values (
      coalesce((f->>'id')::uuid, gen_random_uuid()),
      v_uid,
      f->>'name',
      f->>'icon',
      coalesce((f->>'position')::int, 0)
    )
    returning id into v_file_id;

    for g in select * from jsonb_array_elements(coalesce(f->'groups', '[]'::jsonb))
    loop
      insert into public.planner_groups (id, user_id, file_id, name, position)
      values (
        coalesce((g->>'id')::uuid, gen_random_uuid()),
        v_uid,
        v_file_id,
        g->>'name',
        coalesce((g->>'position')::int, 0)
      )
      returning id into v_group_id;
    end loop;

    for t in select * from jsonb_array_elements(coalesce(f->'todos', '[]'::jsonb))
    loop
      insert into public.planner_todos (
        id, user_id, file_id, group_id, title, done, created_at, done_at,
        completed_from, completed_to, priority, progress, assignees,
        thought, position
      )
      values (
        coalesce((t->>'id')::uuid, gen_random_uuid()),
        v_uid,
        v_file_id,
        nullif(t->>'groupId', '')::uuid,
        t->>'title',
        coalesce((t->>'done')::boolean, false),
        coalesce(to_timestamp((t->>'createdAt')::double precision / 1000), now()),
        case when t->>'doneAt' is not null and t->>'doneAt' != 'null'
          then to_timestamp((t->>'doneAt')::double precision / 1000) end,
        case when t->>'completedFrom' is not null
          then to_timestamp((t->>'completedFrom')::double precision / 1000) end,
        case when t->>'completedTo' is not null
          then to_timestamp((t->>'completedTo')::double precision / 1000) end,
        t->>'priority',
        t->>'progress',
        coalesce(
          (select array_agg(x) from jsonb_array_elements_text(coalesce(t->'assignees', '[]'::jsonb)) x),
          '{}'
        ),
        coalesce(t->>'thought', ''),
        coalesce((t->>'position')::int, 0)
      );
    end loop;
  end loop;

  for f in select * from jsonb_array_elements(coalesce(p_members, '[]'::jsonb))
  loop
    insert into public.planner_members (id, user_id, name, agenda, position)
    values (
      coalesce((f->>'id')::uuid, gen_random_uuid()),
      v_uid,
      f->>'name',
      coalesce(f->>'agenda', ''),
      coalesce((f->>'position')::int, 0)
    );
  end loop;

  insert into public.planner_settings (user_id, active_file_id, settings)
  values (v_uid, p_active_file_id, coalesce(p_settings, '{}'::jsonb))
  on conflict (user_id) do update
    set active_file_id = excluded.active_file_id,
        settings = excluded.settings;
end;
$$;

-- Reconstructs the shape Planner's Redux store expects
-- ({ files: TodoFile[], activeFileId }, { users: User[] }, settings) from
-- the normalized tables in one call.
create or replace function public.get_planner_state()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_files jsonb;
  v_members jsonb;
  v_settings jsonb;
  v_active_file_id uuid;
  v_updated_at timestamptz;
begin
  if v_uid is null then
    return null;
  end if;

  -- No single "last write" column since state is spread across tables now —
  -- take the most recent touch across files/todos/settings, matching what
  -- the old blob's single `updatedAt` meant to Planner's sync comparison
  -- (`remote.updatedAt > localUpdated`).
  select greatest(
    (select max(updated_at) from public.planner_files where user_id = v_uid),
    (select max(updated_at) from public.planner_todos where user_id = v_uid),
    (select updated_at from public.planner_settings where user_id = v_uid)
  )
  into v_updated_at;

  select jsonb_agg(
    jsonb_build_object(
      'id', f.id,
      'name', f.name,
      'icon', f.icon,
      'groups', coalesce((
        select jsonb_agg(jsonb_build_object('id', g.id, 'name', g.name) order by g.position)
        from public.planner_groups g where g.file_id = f.id
      ), '[]'::jsonb),
      'todos', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'id', td.id,
            'title', td.title,
            'done', td.done,
            'createdAt', floor(extract(epoch from td.created_at) * 1000),
            'doneAt', case when td.done_at is not null
              then floor(extract(epoch from td.done_at) * 1000) end,
            'completedFrom', floor(extract(epoch from td.completed_from) * 1000),
            'completedTo', floor(extract(epoch from td.completed_to) * 1000),
            'priority', td.priority,
            'progress', td.progress,
            'assignees', coalesce(to_jsonb(td.assignees), '[]'::jsonb),
            'groupId', td.group_id,
            'thought', td.thought
          )
          order by td.position
        )
        from public.planner_todos td where td.file_id = f.id
      ), '[]'::jsonb)
    )
    order by f.position
  )
  into v_files
  from public.planner_files f
  where f.user_id = v_uid;

  select jsonb_agg(jsonb_build_object('id', m.id, 'name', m.name, 'agenda', m.agenda) order by m.position)
  into v_members
  from public.planner_members m
  where m.user_id = v_uid;

  select s.settings, s.active_file_id into v_settings, v_active_file_id
  from public.planner_settings s
  where s.user_id = v_uid;

  return jsonb_build_object(
    'version', 1,
    'updatedAt', floor(extract(epoch from coalesce(v_updated_at, to_timestamp(0))) * 1000),
    'todos', jsonb_build_object(
      'files', coalesce(v_files, '[]'::jsonb),
      'activeFileId', v_active_file_id
    ),
    'users', jsonb_build_object('users', coalesce(v_members, '[]'::jsonb)),
    'settings', coalesce(v_settings, '{}'::jsonb)
  );
end;
$$;
