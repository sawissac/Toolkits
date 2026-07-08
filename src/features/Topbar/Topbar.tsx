"use client";

import {
  BookText,
  Boxes,
  Check,
  CloudUpload,
  GalleryThumbnails,
  Loader2,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { signOut } from "@/features/AuthLogin";
import { SettingsButton } from "@/features/Settings";
import { FullscreenButton } from "@/features/Topbar/components/FullscreenButton";
import type { SaveState } from "@/hooks/useToolsSync";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * App top bar — wordmark, open-tool breadcrumb, tool count, save action, and sign-out.
 *
 * @param props.toolName - Name of the open tool, shown as a breadcrumb.
 * @param props.toolCount - Total number of tools in the workspace.
 * @param props.onSave - Callback to persist current tools to the database.
 * @param props.saveState - Current save operation status; drives button appearance.
 */
export function Topbar({
  toolName,
  toolCount,
  onSave,
  saveState,
}: {
  toolName: string | null;
  toolCount: number;
  onSave: () => void;
  saveState: SaveState;
}) {
  const [pending, startTransition] = useTransition();
  const { t } = useTranslation();

  function handleSignOut() {
    startTransition(() => signOut());
  }

  const isSaving = saveState === "saving";
  const isSaved = saveState === "saved";
  const isError = saveState === "error";

  return (
    <div className="flex items-center gap-2 border-b-2 border-foreground bg-card px-4 py-2.5">
      <Link
        href="/"
        aria-label={t("topbar.home")}
        className="flex items-center gap-2 rounded-md text-sm font-bold transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <Logo size={24} />
        WauxAiStudio
      </Link>
      {toolName && (
        <span className="truncate text-sm text-muted-foreground">
          ·&nbsp; <b className="font-bold text-foreground">{toolName}</b>
        </span>
      )}

      <div className="ml-auto flex items-center gap-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
          <Boxes size={12} /> {toolCount} {t("topbar.tools")}
        </span>

        <Button
          variant="outline"
          size="sm"
          aria-label={t("topbar.save")}
          disabled={isSaving}
          onClick={onSave}
          className={[
            "h-7 gap-1.5 px-2.5 text-xs font-bold",
            isSaved
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : isError
                ? "border-destructive/40 bg-destructive/10 text-destructive"
                : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
        >
          {isSaving ? (
            <Loader2 className="size-3 animate-spin" />
          ) : isSaved ? (
            <Check className="size-3" />
          ) : (
            <CloudUpload className="size-3" />
          )}
          {isSaving
            ? t("topbar.saving")
            : isSaved
              ? t("topbar.saved")
              : isError
                ? t("topbar.error")
                : t("topbar.save")}
        </Button>

        <Button asChild variant="outline" size="icon-sm" className="size-7">
          <Link
            href="/gallery"
            aria-label={t("gallery.link")}
            title={t("gallery.link")}
          >
            <GalleryThumbnails className="size-4" />
          </Link>
        </Button>

        <Button asChild variant="outline" size="icon-sm" className="size-7">
          <Link
            href="/docs/nodes"
            aria-label={t("docs.link")}
            title={t("docs.link")}
          >
            <BookText className="size-4" />
          </Link>
        </Button>

        <FullscreenButton />

        <SettingsButton />

        <Button
          variant="outline"
          size="icon-sm"
          aria-label={t("topbar.signOut")}
          disabled={pending}
          onClick={handleSignOut}
          className="size-7 bg-destructive text-white hover:bg-destructive hover:text-white"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
