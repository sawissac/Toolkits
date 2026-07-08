"use client";

import {
  MousePointerClick,
  PanelLeftOpen,
  PanelRightOpen,
  SlidersHorizontal,
} from "lucide-react";

import { AppSwitcherRail } from "@/components/customs/AppSwitcherRail";
import {
  ResizableGroup,
  ResizableHandle,
  ResizablePanel,
} from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";
import { PALETTE_GROUPS } from "@/constants/tool-builder";
import { BuilderPanel } from "@/features/BuilderPanel";
import { NodeEditor } from "@/features/NodeEditor";
import { PalettePanel } from "@/features/PalettePanel";
import { ToolsPanel } from "@/features/ToolsPanel";
import { Topbar } from "@/features/Topbar";
import { useBuilderUrlState } from "@/hooks/useBuilderUrlState";
import { useToolBuilder } from "@/hooks/useToolBuilder";
import { useToolsSync } from "@/hooks/useToolsSync";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/stores/hooks";

/**
 * Tool Builder — top-level feature component.
 *
 * Composes the three-panel workspace: tools list (left), node-chain builder +
 * live preview (center), and the contextual right panel. The right panel shows
 * the node editor when a node is selected, the "Node" panel when a tool is
 * open, otherwise nothing. Tool/node state flows through {@link useToolBuilder};
 * the only local UI state here is the center view (builder vs chat) and
 * side-panel visibility — switching to chat hides both side panels, and the
 * build view restores them. Each panel has a collapse button in its own header;
 * a slim {@link CollapsedRail} with an expand button shows in place of a hidden
 * panel.
 *
 * {@link useToolsSync} hydrates the Redux slice from Supabase on mount.
 */
export function ToolBuilder() {
  // Hydrate tools from Supabase into the Redux slice on mount.
  const { saveTools, saveState } = useToolsSync();

  const { tool, tools, selectedNode } = useToolBuilder();
  const loadState = useAppSelector((s) => s.toolBuilder.loadState);
  const isLoading = loadState === "loading";
  const { t } = useTranslation();

  const showEditorInPanel = selectedNode !== null;

  // Center view + side-panel visibility, persisted in the URL so a reload or a
  // shared link reopens the same builder tab and panel layout. Switching to
  // chat hides both panels; returning to a build view (panel / inline) restores
  // them.
  const {
    view,
    leftHidden,
    rightHidden,
    setLeftHidden,
    setRightHidden,
    handleViewChange,
  } = useBuilderUrlState();

  return (
    <div className="flex bg-background text-foreground h-dvh w-dvw">
      <AppSwitcherRail />
      <div className="flex flex-1 min-w-0 flex-col">
        <Topbar
          toolName={tool?.name ?? null}
          toolCount={tools.length}
          onSave={saveTools}
          saveState={saveState}
        />

        <div className="flex min-h-0 flex-1">
          {leftHidden && (
            <CollapsedRail
              side="left"
              icon={PanelLeftOpen}
              label={t("tools.title")}
              onExpand={() => setLeftHidden(false)}
            />
          )}

          <ResizableGroup className="min-h-0 flex-1 flex">
            {!leftHidden && (
              <>
                <ResizablePanel
                  id="tools"
                  defaultSize="350px"
                  minSize="240px"
                  maxSize="480px"
                  className="min-h-0"
                >
                  <aside className="h-full min-h-0">
                    {isLoading ? (
                      <ToolsSkeleton />
                    ) : (
                      <ToolsPanel onHide={() => setLeftHidden(true)} />
                    )}
                  </aside>
                </ResizablePanel>
                <ResizableHandle />
              </>
            )}

            <ResizablePanel
              id="builder"
              minSize="320px"
              className="min-h-0 min-w-0"
            >
              <main className="h-full min-h-0 min-w-0">
                {isLoading ? (
                  <BuilderSkeleton />
                ) : tool ? (
                  <BuilderPanel
                    tool={tool}
                    view={view}
                    onViewChange={handleViewChange}
                  />
                ) : (
                  <EmptyState
                    icon={MousePointerClick}
                    label="Select or create a tool to start building."
                  />
                )}
              </main>
            </ResizablePanel>

            {!rightHidden && (
              <>
                <ResizableHandle />
                <ResizablePanel
                  id="inspector"
                  defaultSize="400px"
                  minSize="300px"
                  maxSize="60%"
                  className="min-h-0"
                >
                  <aside className="h-full min-h-0">
                    {isLoading ? (
                      <PaletteSkeleton />
                    ) : showEditorInPanel && selectedNode ? (
                      <div className="h-full overflow-auto p-4">
                        <NodeEditor node={selectedNode} />
                      </div>
                    ) : tool ? (
                      <PalettePanel onHide={() => setRightHidden(true)} />
                    ) : (
                      <EmptyState
                        icon={SlidersHorizontal}
                        label="Inputs appear here once a tool is open."
                      />
                    )}
                  </aside>
                </ResizablePanel>
              </>
            )}
          </ResizableGroup>

          {rightHidden && (
            <CollapsedRail
              side="right"
              icon={PanelRightOpen}
              label={t("palette.title")}
              onExpand={() => setRightHidden(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Slim rail shown in place of a collapsed side panel: an expand button plus the
 * panel's name written vertically. Clicking re-opens the panel.
 *
 * @param props.side - Which edge the rail sits on (controls its border).
 * @param props.icon - Expand icon (panel-open glyph).
 * @param props.label - Panel name shown vertically.
 * @param props.onExpand - Re-open the panel.
 */
function CollapsedRail({
  side,
  icon: Icon,
  label,
  onExpand,
}: {
  side: "left" | "right";
  icon: typeof MousePointerClick;
  label: string;
  onExpand: () => void;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-11 shrink-0 flex-col items-center gap-3 bg-card py-3",
        side === "left"
          ? "border-r-2 border-foreground"
          : "border-l-2 border-foreground",
      )}
    >
      <button
        type="button"
        aria-label={label}
        onClick={onExpand}
        className="nb-press grid size-8 place-items-center border-2 border-foreground bg-card text-muted-foreground shadow-nb-sm hover:text-foreground"
      >
        <Icon size={15} />
      </button>
      <span className="text-xs font-bold text-muted-foreground [writing-mode:vertical-rl]">
        {label}
      </span>
    </div>
  );
}

/**
 * Centered placeholder for an empty pane: a boxed icon above a short label.
 * Used for both the builder canvas and the inspector before a tool is open.
 */
function EmptyState({
  icon: Icon,
  label,
}: {
  icon: typeof MousePointerClick;
  label: string;
}) {
  return (
    <div className="grid h-full place-items-center p-6">
      <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
        <span className="grid size-12 place-items-center border-2 border-foreground bg-card shadow-nb">
          <Icon className="size-6" aria-hidden />
        </span>
        <p className="max-w-xs text-sm">{label}</p>
      </div>
    </div>
  );
}

function ToolsSkeleton() {
  return (
    <div className="relative flex h-full flex-col">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b-2 border-foreground px-4">
        <span className="text-sm font-bold">Tools</span>
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="size-8 border-2 border-foreground shadow-nb-sm" />
          <Skeleton className="size-8 border-2 border-foreground shadow-nb-sm" />
        </div>
      </div>
      <div className="border-b-2 border-foreground px-3 py-2.5">
        <Skeleton className="h-8 w-full border-2 border-foreground" />
      </div>
      <div className="flex-1 overflow-auto p-2">
        <div className="flex flex-col gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 border-2 border-foreground bg-card px-2.5 py-2"
            >
              <Skeleton className="size-1.5 shrink-0 rounded-full border-0" />
              <Skeleton
                className="h-3 flex-1 border-0"
                style={{ width: `${50 + ((i * 17) % 40)}%` }}
              />
              <Skeleton className="size-7 shrink-0 rounded-md border-0" />
            </div>
          ))}
        </div>
      </div>
      <div className="border-t-2 border-foreground p-3">
        <Skeleton className="h-9 w-full border-2 border-foreground" />
      </div>
    </div>
  );
}

function PaletteSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b-2 border-foreground px-4">
        <span className="text-sm font-bold">Node</span>
      </div>
      <div className="flex-1 overflow-auto p-3">
        <div className="flex flex-col gap-4">
          {PALETTE_GROUPS.map(({ group, types }) => (
            <div key={group} className="flex flex-col gap-1.5">
              <Skeleton className="mx-1 h-2 w-12 border-0" />
              <div className="flex flex-col gap-1.5">
                {types.map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 border-2 border-foreground bg-card p-2.5"
                  >
                    <Skeleton className="size-8 shrink-0 border-2 border-foreground/15" />
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
                      <Skeleton className="h-2.5 w-20 border-0" />
                      <Skeleton className="h-2 w-36 border-0" />
                    </div>
                    <Skeleton className="size-6 shrink-0 rounded-md border-0" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NodeCardSkeleton() {
  return (
    <div className="flex items-start gap-3 border-2 border-foreground bg-card p-2.5">
      <Skeleton className="size-8 shrink-0 border-2 border-foreground/15" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
        <Skeleton className="h-2.5 w-20 border-0" />
        <Skeleton className="h-2 w-36 border-0" />
      </div>
      <Skeleton className="size-6 shrink-0 rounded-md border-0" />
    </div>
  );
}

function BuilderSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b-2 border-foreground px-4">
        <span className="text-sm font-bold">Builder</span>
        <Skeleton className="h-3 w-28 border-0" />
        <div className="ml-auto">
          <Skeleton className="h-7 w-24 border-0" />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mx-auto flex max-w-2xl flex-col">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col">
              {i > 0 && (
                <span
                  className="mx-auto h-5 w-0 border-l-2 border-foreground"
                  aria-hidden
                />
              )}
              <NodeCardSkeleton />
            </div>
          ))}
          <span
            className="mx-auto h-5 w-0 border-l border-dashed border-border"
            aria-hidden
          />
          <Skeleton className="h-14 border-2 border-dashed border-foreground/40" />
        </div>
      </div>
    </div>
  );
}
