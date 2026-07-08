"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, PackageOpen } from "lucide-react";
import Link from "next/link";

import { ToolIcon } from "@/components/customs/ToolIcon";
import { Logo } from "@/components/ui/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/useTranslation";
import type { PublicGallery as PublicGalleryData } from "@/types/gallery";

async function fetchPublicGallery(handle: string): Promise<PublicGalleryData> {
  const res = await fetch(`/api/gallery/${encodeURIComponent(handle)}`);
  if (!res.ok) {
    throw new Error("not_found");
  }
  return res.json();
}

/**
 * Public gallery page — a card grid of a user's published tools, addressed by
 * handle. Each card opens that tool's existing public preview page
 * (`/<toolId>`). Read-only: no auth, no builder UI, and the owner's identity is
 * never exposed (the API resolves it server-side and returns only tool cards).
 *
 * @param props.handle - The gallery handle from the share URL.
 */
export function PublicGallery({ handle }: { handle: string }) {
  const { t } = useTranslation();
  const {
    data: gallery,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["public-gallery", handle],
    queryFn: () => fetchPublicGallery(handle),
    retry: false,
  });

  const heading = gallery?.title?.trim() || `@${handle}`;

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b-2 border-foreground bg-card px-4">
        <Link
          href="/"
          aria-label={t("topbar.home")}
          className="shrink-0 rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Logo size={24} title="WauxAiStudio" />
        </Link>
        <span className="flex-1 truncate text-sm font-bold">
          {isLoading ? (
            <Skeleton className="inline-block h-4 w-40 border-0" />
          ) : (
            heading
          )}
        </span>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto w-full max-w-3xl">
          {isLoading && (
            <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4 md:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="size-16 rounded-[22%] shadow-nb-sm" />
                  <Skeleton className="h-3 w-12 border-0" />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="mx-auto flex max-w-md flex-col items-center gap-3 border-2 border-dashed border-destructive py-16 text-center text-sm text-muted-foreground">
              <AlertTriangle size={24} className="text-destructive" />
              <span>{t("gallery.notFound")}</span>
            </div>
          )}

          {gallery && (
            <>
              <div className="mb-8 flex flex-col gap-1.5">
                <h1 className="font-display text-2xl font-bold sm:text-3xl">
                  {heading}
                </h1>
                {gallery.description.trim() && (
                  <p className="max-w-2xl text-sm text-muted-foreground">
                    {gallery.description}
                  </p>
                )}
              </div>

              {gallery.tools.length === 0 ? (
                <div className="mx-auto flex max-w-md flex-col items-center gap-3 border-2 border-dashed border-foreground/30 py-16 text-center text-sm text-muted-foreground">
                  <span className="grid size-12 place-items-center border-2 border-foreground bg-card shadow-nb">
                    <PackageOpen className="size-6" aria-hidden />
                  </span>
                  <p>{t("gallery.publicEmpty")}</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4 md:grid-cols-5">
                  {gallery.tools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/${tool.id}`}
                      title={tool.name}
                      className="group flex flex-col items-center gap-2 text-center"
                    >
                      <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-[22%] border-2 border-foreground bg-card text-foreground shadow-nb-sm transition-transform duration-(--motion-duration-fast) group-hover:-translate-y-0.5 group-active:translate-y-0 [html[data-reduced-motion]_&]:transition-none [html[data-reduced-motion]_&]:group-hover:translate-y-0">
                        <ToolIcon svg={tool.icon} className="size-8" />
                      </span>
                      <span className="line-clamp-2 w-full text-xs font-bold leading-tight">
                        {tool.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="flex h-10 shrink-0 items-center justify-center border-t-2 border-foreground bg-card">
        <span className="text-xs text-muted-foreground/50">
          {t("gallery.builtWith")}
        </span>
      </footer>
    </div>
  );
}
