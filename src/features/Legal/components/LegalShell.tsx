import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { GithubLink } from "@/components/customs/GithubLink";
import { ThemeToggle } from "@/components/customs/ThemeToggle";
import { Logo } from "@/components/ui/logo";

/**
 * Shared chrome for the public legal pages (`/privacy`, `/terms`).
 *
 * Renders a sticky neobrutalism topbar (brand → home + back-to-studio) above a
 * centred `prose` column, and a footer that cross-links the two legal
 * documents. Pure presentational wrapper — the page-specific prose is passed in
 * as {@link children}. Reachable while logged out, so it carries its own
 * navigation rather than relying on the authenticated app shell.
 *
 * Copy is English-only here, matching the public marketing landing page (`/`);
 * the bilingual `t()` layer is reserved for the in-app product UI.
 *
 * @param props.title - Document title shown in the header and as the page H1.
 * @param props.updated - Human-readable "last updated" date.
 * @param props.children - The rendered legal prose (`prose`-styled).
 */
export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-md supports-backdrop-filter:bg-card/70">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={26} />
            <span className="font-display text-base font-bold">
              WauxAiStudio
            </span>
          </Link>
          <nav className="ml-auto flex items-center gap-1.5">
            <ThemeToggle />
            <GithubLink />
            <Link
              href="/studio"
              className="nb-press flex items-center gap-1.5 border-2 border-foreground bg-card px-2.5 py-1 text-sm font-semibold shadow-nb-sm"
            >
              <ArrowLeft size={14} />
              Studio
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <h1 className="font-display text-4xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {updated}
        </p>
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-headings:font-display prose-a:text-foreground">
          {children}
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}

/** Footer shared by the legal pages — brand + cross-links to both documents. */
function LegalFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <Link
          href="/"
          aria-label="WauxAiStudio — home"
          className="flex items-center gap-2 rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Logo size={20} />
          <span className="font-display text-sm font-bold">WauxAiStudio</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms &amp; Conditions
          </Link>
        </nav>
      </div>
    </footer>
  );
}
