"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Chrome for the `/docs/**` section: a sticky neobrutalism topbar (brand +
 * back-to-Studio link) above a centred `prose` column that styles authored
 * MDX. Mounted by `src/app/docs/layout.tsx`; `children` is the rendered MDX.
 *
 * All user-facing copy resolves through `t()` so the docs shell is bilingual
 * like the rest of the app. "WauxAiStudio" is a brand name and stays as-is.
 */
export function DocsShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b-2 border-foreground bg-background px-4">
        <Button asChild variant="ghost" size="sm" className="h-7 gap-1.5 px-2">
          <Link href="/studio" aria-label={t("docs.backToStudio")}>
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">{t("docs.backToStudio")}</span>
          </Link>
        </Button>
        <Link
          href="/"
          aria-label={t("topbar.home")}
          className="flex items-center gap-2 rounded-md font-semibold transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Logo size={22} />
          <span className="font-poppins">{t("docs.title")}</span>
        </Link>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-poppins prose-a:text-foreground">
          {children}
        </div>
      </main>
    </div>
  );
}
