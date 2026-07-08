"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { useCallback, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

/** Where the enter button hands off to. */
const STUDIO_PATH = "/studio";

/**
 * Post-login welcome landing. A branded neubrutalist hero — eyebrow, headline,
 * subtitle, and a single "Enter studio" call to action, alongside a node-chain
 * illustration that previews the product. Only reached right after a successful
 * sign-in (`signIn` redirects here), so the studio stays instant on direct
 * visits.
 */
export function WelcomeSplash() {
  const router = useRouter();
  const { t } = useTranslation();

  /** Guards against a double navigation from a rapid double-click. */
  const enteredRef = useRef(false);

  const enterStudio = useCallback(() => {
    if (enteredRef.current) {
      return;
    }
    enteredRef.current = true;
    router.push(STUDIO_PATH);
  }, [router]);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
      <BackgroundDecor />

      {/* Wordmark — top-left. */}
      <header className="relative z-10 flex items-center p-6">
        <Link
          href="/"
          aria-label={t("topbar.home")}
          className="flex items-center gap-2 rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Logo size={32} />
          <span className="font-display text-lg font-semibold text-foreground">
            WauxAiStudio
          </span>
        </Link>
      </header>

      {/* Hero. */}
      <main className="relative z-10 flex flex-1 items-center px-6 pb-10">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
          {/* Copy + CTA. */}
          <div className="flex flex-col items-start gap-6">
            <span
              className={cn(
                "nb-surface inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1",
                "text-xs font-bold uppercase tracking-wider text-primary-foreground",
                "animate-in fade-in slide-in-from-bottom-2 duration-[--motion-duration-slow]",
              )}
            >
              <span className="size-2 animate-pulse rounded-full bg-foreground" />
              {t("welcome.eyebrow")}
            </span>

            <h1
              className={cn(
                "font-display text-5xl font-bold leading-[1.04] text-foreground sm:text-6xl",
                "animate-in fade-in slide-in-from-bottom-3 duration-[--motion-duration-slow]",
              )}
              style={{ animationDelay: "80ms" }}
            >
              {t("welcome.title")}
            </h1>

            <p
              className={cn(
                "max-w-md text-base leading-relaxed text-muted-foreground",
                "animate-in fade-in slide-in-from-bottom-3 duration-[--motion-duration-slow]",
              )}
              style={{ animationDelay: "160ms" }}
            >
              {t("welcome.subtitle")}
            </p>

            <div
              className={cn(
                "animate-in fade-in slide-in-from-bottom-3 duration-[--motion-duration-slow]",
              )}
              style={{ animationDelay: "240ms" }}
            >
              <Button
                type="button"
                size="lg"
                className="h-12 px-7 text-base"
                onClick={enterStudio}
                autoFocus
              >
                {t("welcome.enter")}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Node-chain illustration. */}
          <NodeChain />
        </div>
      </main>
    </div>
  );
}

/** The three product nodes, rendered as a connected vertical chain. */
function NodeChain() {
  const { t } = useTranslation();

  const nodes = [
    { key: "welcome.node.input", marker: "bg-ring", rotate: "-1.5deg" },
    { key: "welcome.node.logic", marker: "bg-primary", rotate: "1.5deg" },
    { key: "welcome.node.output", marker: "bg-chart-4", rotate: "-1deg" },
  ] as const;

  return (
    <div
      className={cn(
        "relative mx-auto hidden w-full max-w-xs flex-col items-center gap-5 lg:flex",
        "animate-in fade-in slide-in-from-bottom-4 duration-[--motion-duration-slow]",
      )}
      style={{ animationDelay: "300ms" }}
      aria-hidden="true"
    >
      {/* Continuous spine behind the cards — opaque cards cover it, so it only
          shows through the gaps; per-card tilt can't break it. */}
      <span className="absolute inset-y-6 left-1/2 z-0 w-0.5 -translate-x-1/2 bg-foreground" />

      {nodes.map((node, i) => (
        <div
          key={node.key}
          className={cn(
            "node-card nb-surface relative z-10 flex w-full items-center gap-3 rounded-md bg-card px-4 py-3.5",
            "motion-safe:animate-[wfloat_4s_ease-in-out_infinite]",
          )}
          style={
            {
              "--r": node.rotate,
              animationDelay: `${i * 400}ms`,
            } as CSSProperties
          }
        >
          <span
            className={cn(
              "size-3.5 shrink-0 border-2 border-foreground",
              node.marker,
            )}
          />
          <span className="font-display text-sm font-bold text-foreground">
            {t(node.key)}
          </span>
          <span className="ml-auto flex gap-1">
            <span className="size-1.5 rounded-full bg-muted-foreground/40" />
            <span className="size-1.5 rounded-full bg-muted-foreground/40" />
          </span>
        </div>
      ))}

      <style>{`@keyframes wfloat{0%,100%{translate:0 0}50%{translate:0 -6px}}`}</style>
    </div>
  );
}

/** Layered, low-key neubrutalist background: faint grid + drifting blocks. */
function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Faint dotted grid. */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(var(--foreground) 1.2px, transparent 1.2px)",
          backgroundSize: "26px 26px",
        }}
      />
      {/* Big offset colour blocks — hard, no blur, gently drifting. */}
      <div
        className="absolute -left-24 -top-24 size-72 rotate-12 border-2 border-foreground bg-primary/15 motion-safe:animate-[wdrift_11s_ease-in-out_infinite]"
        style={{ boxShadow: "var(--nb-shadow-lg)" }}
      />
      <div
        className="absolute -bottom-28 right-[-6rem] size-80 -rotate-6 border-2 border-foreground bg-ring/10 motion-safe:animate-[wdrift_13s_ease-in-out_infinite_reverse]"
        style={{ boxShadow: "var(--nb-shadow-lg)" }}
      />
      <style>{`@keyframes wdrift{0%,100%{translate:0 0}50%{translate:14px -18px}}`}</style>
    </div>
  );
}
