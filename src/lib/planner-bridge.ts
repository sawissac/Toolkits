"use client";

import { createClient } from "@/lib/supabase/client";

/**
 * Bridge into Planner's normalized Supabase tables (same project, this repo
 * owns the CLI-linked migrations —
 * `supabase/migrations/20260707000000_normalize_planner_schema.sql`). Planner
 * itself talks to these tables through two RPCs (`upsert_planner_state` /
 * `get_planner_state`, one call per push/pull); this bridge queries
 * `planner_files` / `planner_todos` directly since it only ever touches one
 * task at a time — an atomic `insert`, not a whole-state read-modify-write.
 *
 * Reading/writing requires the browser to be signed into THIS app (toolkits)
 * with the same Supabase account used in Planner — RLS scopes every row to
 * `auth.uid()`, not to which app's cookies established the session.
 */

export type PlannerTodo = {
  id: string;
  title: string;
  done: boolean;
  thought: string;
};

/** A todo picked in the chat composer to reference (title + notes), not yet sent. */
export type PlannerReference = {
  todoId: string;
  title: string;
  fileName: string;
  thought: string;
};

export type PlannerFile = {
  id: string;
  name: string;
  todos: PlannerTodo[];
};

/**
 * Fetch the signed-in user's Planner files + todos (read-only reference).
 * Returns `null` if the user isn't signed in, or has no files yet (never
 * pushed a Planner sync).
 */
export async function fetchPlannerFiles(): Promise<PlannerFile[] | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data: files, error: filesError } = await supabase
    .from("planner_files")
    .select("id, name")
    .eq("user_id", user.id)
    .order("position");
  if (filesError) {
    throw new Error(filesError.message);
  }
  if (!files || files.length === 0) {
    return [];
  }

  const { data: todos, error: todosError } = await supabase
    .from("planner_todos")
    .select("id, file_id, title, done, thought")
    .eq("user_id", user.id)
    .order("position");
  if (todosError) {
    throw new Error(todosError.message);
  }

  return files.map((f) => ({
    id: f.id,
    name: f.name,
    todos: (todos ?? [])
      .filter((t) => t.file_id === f.id)
      .map((t) => ({
        id: t.id,
        title: t.title,
        done: t.done,
        thought: t.thought ?? "",
      })),
  }));
}

/**
 * Insert a new todo into the named Planner file — a single atomic `insert`,
 * not a read-modify-write of shared state. `position` appends to the end of
 * the file's existing todos (best-effort: two concurrent adds could land on
 * the same position, a cosmetic ordering hiccup, not data loss).
 *
 * @param thought - Optional notes body (Planner's own "quick add" defaults
 *   this to empty). Used to save a chat transcript onto the task.
 */
export async function addPlannerTodo(
  fileId: string,
  title: string,
  thought = "",
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error(
      "No Planner account found — sign in and sync in Planner first.",
    );
  }

  const { count, error: countError } = await supabase
    .from("planner_todos")
    .select("id", { count: "exact", head: true })
    .eq("file_id", fileId);
  if (countError) {
    throw new Error(countError.message);
  }

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const { error } = await supabase.from("planner_todos").insert({
    user_id: user.id,
    file_id: fileId,
    title,
    done: false,
    completed_from: startOfDay.toISOString(),
    completed_to: endOfDay.toISOString(),
    progress: "Not Started",
    assignees: [],
    thought,
    position: count ?? 0,
  });
  if (error) {
    throw new Error(error.message);
  }
}
