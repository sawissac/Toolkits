"use client";

import { ChevronDown, Import, ListTodo, Loader2, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addPlannerTodo,
  fetchPlannerFiles,
  type PlannerFile,
  type PlannerReference,
} from "@/lib/planner-bridge";
import { cn } from "@/lib/utils";

/**
 * Composer-row button opening a popover into the signed-in user's Planner
 * data. Two things live here: browsing tasks to reference a task (added as a
 * small removable chip above the composer via {@link onReference} — the user
 * picks by click, nothing is sent to the model automatically, and nothing is
 * dumped into the draft textarea) and a quick-add form to save a new task
 * into a named list. Requires the same Supabase account to be signed into
 * both toolkits and Planner — see `@/lib/planner-bridge`.
 *
 * @param props.onReference - Called with the picked task when the user clicks
 *   it, to show as a reference chip above the composer.
 * @param props.getTranscript - Returns the current chat transcript as
 *   Markdown, or `null` if there's nothing to save yet. Used when the user
 *   checks "Save this conversation" on the quick-add form.
 * @param props.onImport - Called with a task's notes when the user clicks its
 *   import icon, to load it as the chat transcript (replaces the current
 *   conversation — same as importing a `.md` file). Only tasks with a
 *   non-empty `thought` show the icon; nothing validates the content is
 *   actually a saved conversation before handing it off.
 */
export function PlannerQuickAdd({
  onReference,
  getTranscript,
  onImport,
}: {
  onReference: (ref: PlannerReference) => void;
  getTranscript: () => string | null;
  onImport: (markdown: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<PlannerFile[] | null>(null);
  const [expandedFileId, setExpandedFileId] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [includeConversation, setIncludeConversation] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchPlannerFiles();
      setFiles(result ?? []);
      // Keep the current selection if it still exists; otherwise fall back
      // to the first file. Avoids jumping the picker around on every
      // background refetch (focus/tab-change) while the user is browsing.
      setFileId((prev) =>
        result?.some((f) => f.id === prev) ? prev : (result?.[0]?.id ?? ""),
      );
      setExpandedFileId((prev) =>
        result?.some((f) => f.id === prev) ? prev : (result?.[0]?.id ?? null),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      void loadFiles();
    }
  }

  // Refetch whenever the browser tab regains focus or becomes visible again,
  // so switching back from Planner (after signing in / syncing) shows fresh
  // data without needing to reopen the popover. Only while it's open — no
  // point polling Supabase in the background.
  useEffect(() => {
    if (!open) {
      return;
    }
    const onFocus = () => void loadFiles();
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void loadFiles();
      }
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [open, loadFiles]);

  function handlePick(fileName: string, todo: PlannerFile["todos"][number]) {
    onReference({
      todoId: todo.id,
      title: todo.title,
      fileName,
      thought: todo.thought.trim(),
    });
    setOpen(false);
  }

  async function handleSave() {
    const trimmed = title.trim();
    if (!trimmed || !fileId) {
      return;
    }
    setSaving(true);
    try {
      const thought = includeConversation ? (getTranscript() ?? "") : "";
      await addPlannerTodo(fileId, trimmed, thought);
      toast.success(
        includeConversation
          ? "Saved to Planner with conversation"
          : "Saved to Planner",
      );
      setTitle("");
      setIncludeConversation(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save to Planner");
    } finally {
      setSaving(false);
    }
  }

  const hasTranscript = getTranscript() !== null;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="outline"
          title="Planner"
          aria-label="Planner"
        >
          <ListTodo />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="top" className="w-96">
        <PopoverHeader>
          <PopoverTitle>Planner</PopoverTitle>
          <PopoverDescription>
            Click a task to reference its notes, use the import icon to load a
            saved conversation, or save a new task below.
          </PopoverDescription>
        </PopoverHeader>

        <div className="mt-3 space-y-3">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" /> Loading…
            </div>
          ) : !files || files.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No Planner backup found. Sign in and enable cloud sync in Planner
              first — see the app switcher in the sidebar.
            </p>
          ) : (
            <>
              <div className="max-h-64 space-y-1 overflow-auto">
                {files.map((f) => {
                  const isExpanded = expandedFileId === f.id;
                  return (
                    <div key={f.id}>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedFileId(isExpanded ? null : f.id)
                        }
                        className="flex w-full items-center justify-between border-b border-border py-1.5 text-left text-xs"
                      >
                        <span className="truncate font-bold">{f.name}</span>
                        <span className="flex shrink-0 items-center gap-1 text-muted-foreground">
                          {f.todos.length} tasks
                          <ChevronDown
                            className={cn(
                              "size-3 transition-transform",
                              isExpanded && "rotate-180",
                            )}
                          />
                        </span>
                      </button>
                      {isExpanded && (
                        <ul className="space-y-0.5 py-1 pl-2">
                          {f.todos.length === 0 && (
                            <li className="py-1 text-xs text-muted-foreground">
                              No tasks in this list.
                            </li>
                          )}
                          {f.todos.map((todo) => {
                            const notes = todo.thought.trim();
                            return (
                              <li
                                key={todo.id}
                                className="flex items-center gap-1"
                              >
                                <button
                                  type="button"
                                  onClick={() => handlePick(f.name, todo)}
                                  className="min-w-0 flex-1 rounded-md px-1.5 py-1 text-left text-xs hover:bg-accent"
                                >
                                  <span
                                    className={cn(
                                      "block truncate font-medium",
                                      todo.done &&
                                        "text-muted-foreground line-through",
                                    )}
                                  >
                                    {todo.title}
                                  </span>
                                  {notes && (
                                    <span className="block truncate text-muted-foreground">
                                      {notes}
                                    </span>
                                  )}
                                </button>
                                {notes && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onImport(notes);
                                      setOpen(false);
                                    }}
                                    title="Import as conversation"
                                    aria-label={`Import "${todo.title}" as conversation`}
                                    className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                  >
                                    <Import className="size-3.5" />
                                  </button>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 border-t-2 border-foreground pt-3">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSave();
                    }
                  }}
                  placeholder="New task title…"
                  disabled={saving}
                  className="h-8 w-full border-2 border-foreground bg-background px-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
                />
                {hasTranscript && (
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={includeConversation}
                      onChange={(e) => setIncludeConversation(e.target.checked)}
                      disabled={saving}
                      className="size-3.5 accent-primary"
                    />
                    Save this conversation as notes
                  </label>
                )}
                <div className="flex items-center gap-2">
                  <Select
                    value={fileId}
                    onValueChange={setFileId}
                    disabled={saving}
                  >
                    <SelectTrigger size="sm" className="h-8 flex-1 text-xs">
                      <SelectValue placeholder="File…" />
                    </SelectTrigger>
                    <SelectContent>
                      {files.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    size="sm"
                    disabled={saving || !title.trim() || !fileId}
                    onClick={handleSave}
                    className="h-8 shrink-0"
                  >
                    {saving ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Plus className="size-3.5" />
                    )}
                    Add
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
