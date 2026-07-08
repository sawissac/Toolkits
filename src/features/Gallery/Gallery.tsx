"use client";

import { ArrowLeft, Copy, ExternalLink, Loader2, Wrench } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ToolIcon } from "@/components/customs/ToolIcon";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { HANDLE_INVALID, HANDLE_TAKEN, useGallery } from "@/hooks/useGallery";
import { useTranslation } from "@/hooks/useTranslation";
import { isValidHandle, normalizeHandle } from "@/lib/gallery";
import { cn } from "@/lib/utils";
import type { GalleryTool } from "@/types/gallery";

import { GalleryToggle } from "./components/GalleryToggle";

const inputCls =
  "h-9 w-full border-2 border-foreground bg-background px-3 text-sm outline-none transition-colors duration-(--motion-duration-fast) focus-visible:ring-2 focus-visible:ring-ring/40";

/**
 * Gallery manager (signed-in owner). Configures the public gallery — handle,
 * title, description, and the master public toggle — and lists every tool with
 * its membership + public/private controls. A tool shows on the public page
 * only when the gallery is public AND the tool is in the gallery AND public.
 *
 * Gallery settings + flags persist straight to Supabase via `useGallery`
 * (outside the Tool Builder save cycle), so they survive tool saves. The
 * owner's user id never reaches the client — the public URL keys off the handle.
 *
 * Mounted by `app/gallery/page.tsx`.
 */
export function Gallery() {
  const { t } = useTranslation();
  const {
    gallery,
    galleryTools,
    isLoading,
    updateGallery,
    isUpdating,
    setToolInGallery,
    setToolShared,
  } = useGallery();

  const [handleInput, setHandleInput] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [handleError, setHandleError] = useState<string | null>(null);

  // Seed the form from the fetched gallery exactly once, so live edits aren't
  // clobbered by background refetches.
  const seeded = useRef(false);
  useEffect(() => {
    if (gallery && !seeded.current) {
      setHandleInput(gallery.handle ?? "");
      setTitle(gallery.title);
      setDescription(gallery.description);
      seeded.current = true;
    }
  }, [gallery]);

  /** Full public URL for the current handle, or null when unclaimed. */
  function publicUrl(): string | null {
    return gallery?.handle
      ? `${window.location.origin}/g/${gallery.handle}`
      : null;
  }

  async function handleSave() {
    const normalized = normalizeHandle(handleInput);
    if (handleInput.trim() && !isValidHandle(normalized)) {
      setHandleError(t("gallery.handleInvalid"));
      return;
    }
    setHandleError(null);
    try {
      await updateGallery({ handle: normalized, title, description });
      setHandleInput(normalized);
      toast.success(t("gallery.saved"));
    } catch (err) {
      if (err instanceof Error && err.message === HANDLE_TAKEN) {
        setHandleError(t("gallery.handleTaken"));
        toast.error(t("gallery.handleTaken"));
      } else if (err instanceof Error && err.message === HANDLE_INVALID) {
        setHandleError(t("gallery.handleInvalid"));
        toast.error(t("gallery.handleInvalid"));
      } else {
        toast.error(t("gallery.saveError"));
      }
    }
  }

  async function handleTogglePublic(next: boolean) {
    if (next && !gallery?.handle) {
      toast.error(t("gallery.handleRequired"));
      return;
    }
    try {
      await updateGallery({ isPublic: next });
    } catch {
      toast.error(t("gallery.saveError"));
    }
  }

  async function toggleInGallery(tool: GalleryTool, next: boolean) {
    try {
      await setToolInGallery(tool.id, next);
      toast.success(next ? t("gallery.added") : t("gallery.removed"));
    } catch {
      toast.error(t("gallery.flagError"));
    }
  }

  async function toggleToolPublic(tool: GalleryTool, next: boolean) {
    try {
      await setToolShared(tool.id, next);
      toast.success(next ? t("gallery.madePublic") : t("gallery.madePrivate"));
    } catch {
      toast.error(t("gallery.flagError"));
    }
  }

  async function copyLink() {
    const url = publicUrl();
    if (!url) {
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success(t("gallery.linkCopied"));
  }

  const hasHandle = !!gallery?.handle;

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b-2 border-foreground bg-card px-4">
        <Button asChild variant="ghost" size="sm" className="h-7 gap-1.5 px-2">
          <Link href="/studio" aria-label={t("gallery.back")}>
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">{t("gallery.back")}</span>
          </Link>
        </Button>
        <Link
          href="/"
          aria-label={t("topbar.home")}
          className="flex items-center gap-2 rounded-md text-sm font-bold transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Logo size={22} />
          {t("gallery.title")}
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 px-2.5 text-xs font-bold"
            disabled={!hasHandle}
            onClick={copyLink}
          >
            <Copy className="size-3.5" />
            <span className="hidden sm:inline">{t("gallery.copyLink")}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 px-2.5 text-xs font-bold"
            disabled={!hasHandle}
            onClick={() => {
              const url = publicUrl();
              if (url) {
                window.open(url, "_blank", "noopener,noreferrer");
              }
            }}
          >
            <ExternalLink className="size-3.5" />
            <span className="hidden sm:inline">{t("gallery.openPublic")}</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-6">
          {isLoading ? (
            <GallerySkeleton />
          ) : (
            <>
              {/* ----------------------------------------------- settings -- */}
              <section className="nb-surface space-y-3 bg-card p-4">
                <div>
                  <h2 className="font-display text-base font-bold">
                    {t("gallery.settings")}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {t("gallery.subtitle")}
                  </p>
                </div>

                {/* Handle + Title side by side */}
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="gallery-handle"
                      className="text-[11px] font-medium text-muted-foreground"
                    >
                      {t("gallery.handle")}
                    </label>
                    <div className="flex items-stretch">
                      <span className="inline-flex select-none items-center border-2 border-r-0 border-foreground bg-muted px-2 font-mono text-sm text-muted-foreground">
                        /g/
                      </span>
                      <input
                        id="gallery-handle"
                        value={handleInput}
                        onChange={(e) => {
                          setHandleInput(e.target.value);
                          setHandleError(null);
                        }}
                        placeholder={t("gallery.handlePlaceholder")}
                        spellCheck={false}
                        autoCapitalize="none"
                        className={cn(inputCls, "min-w-0 flex-1 font-mono")}
                      />
                    </div>
                    {handleError ? (
                      <p className="text-[11px] font-medium text-destructive">
                        {handleError}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="gallery-title"
                      className="text-[11px] font-medium text-muted-foreground"
                    >
                      {t("gallery.titleLabel")}
                    </label>
                    <input
                      id="gallery-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t("gallery.titlePlaceholder")}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="gallery-description"
                    className="text-[11px] font-medium text-muted-foreground"
                  >
                    {t("gallery.description")}
                  </label>
                  <textarea
                    id="gallery-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("gallery.descriptionPlaceholder")}
                    rows={2}
                    className="w-full resize-y border-2 border-foreground bg-background px-3 py-1.5 text-sm outline-none transition-colors duration-(--motion-duration-fast) focus-visible:ring-2 focus-visible:ring-ring/40"
                  />
                </div>

                {/* Public toggle + save on one row */}
                <div className="flex items-center justify-between gap-3 border-t-2 border-foreground pt-3">
                  <div className="flex items-center gap-2">
                    <GalleryToggle
                      checked={!!gallery?.isPublic}
                      onChange={handleTogglePublic}
                      disabled={!hasHandle || isUpdating}
                      label={t("gallery.public")}
                    />
                    <span className="text-xs font-bold">
                      {t("gallery.public")}
                    </span>
                  </div>
                  <Button size="sm" onClick={handleSave} disabled={isUpdating}>
                    {isUpdating ? <Loader2 className="animate-spin" /> : null}
                    {t("gallery.save")}
                  </Button>
                </div>
              </section>

              {/* -------------------------------------------------- tools -- */}
              <section className="space-y-2.5">
                <div>
                  <h2 className="font-display text-base font-bold">
                    {t("gallery.toolsTitle")}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {t("gallery.toolsHint")}
                  </p>
                </div>

                {galleryTools.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 border-2 border-dashed border-foreground/30 py-16 text-center text-sm text-muted-foreground">
                    <span className="grid size-12 place-items-center border-2 border-foreground bg-card shadow-nb">
                      <Wrench className="size-6" aria-hidden />
                    </span>
                    <p className="max-w-[18rem]">{t("gallery.empty")}</p>
                  </div>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {galleryTools.map((tool) => {
                      const shown =
                        !!gallery?.isPublic && tool.inGallery && tool.isShared;
                      return (
                        <div
                          key={tool.id}
                          className="nb-surface flex flex-col gap-2 bg-card p-2.5"
                        >
                          <div className="flex items-center gap-2">
                            <span className="grid size-7 shrink-0 place-items-center border-2 border-foreground bg-background text-foreground">
                              <ToolIcon
                                svg={tool.icon}
                                className="size-4 text-muted-foreground"
                              />
                            </span>
                            <span className="flex-1 truncate text-xs font-bold">
                              {tool.name}
                            </span>
                            <span
                              className={cn(
                                "shrink-0 border-2 border-foreground px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide",
                                shown
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              {shown
                                ? t("gallery.shownBadge")
                                : t("gallery.hiddenBadge")}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 border-t-2 border-foreground/15 pt-2">
                            <div className="flex items-center gap-1.5">
                              <GalleryToggle
                                checked={tool.inGallery}
                                onChange={(next) => toggleInGallery(tool, next)}
                                label={t("gallery.inGallery")}
                              />
                              <span className="text-[11px] font-medium text-muted-foreground">
                                {t("gallery.inGallery")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-medium text-muted-foreground">
                                {tool.isShared
                                  ? t("gallery.publicTool")
                                  : t("gallery.privateTool")}
                              </span>
                              <GalleryToggle
                                checked={tool.isShared}
                                onChange={(next) =>
                                  toggleToolPublic(tool, next)
                                }
                                label={t("gallery.publicTool")}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

/** Skeleton placeholder matching the settings card + tool grid layout. */
function GallerySkeleton() {
  return (
    <>
      <section className="nb-surface space-y-3 bg-card p-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-9 w-full shadow-nb-sm" />
        <Skeleton className="h-9 w-full shadow-nb-sm" />
        <Skeleton className="h-20 w-full shadow-nb-sm" />
        <Skeleton className="h-9 w-28 shadow-nb-sm" />
      </section>
      <div className="grid gap-2 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full shadow-nb-sm" />
        ))}
      </div>
    </>
  );
}
