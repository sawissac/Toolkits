import {
  ArrowRight,
  ChevronDown,
  Eye,
  GitBranch,
  Share2,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { type CSSProperties, Fragment } from "react";

import { GithubLink } from "@/components/customs/GithubLink";
import { ThemeToggle } from "@/components/customs/ThemeToggle";
import { FlowArrowIcon } from "@/components/icons/FlowArrowIcon";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "WauxAiStudio — Build tools as visual node chains",
  description:
    "Compose tools as a top-to-bottom chain of input, logic, and output nodes with a live, interactive preview. No backend required.",
};

/**
 * Public marketing landing page. Describes the product and routes visitors into
 * the studio (`/studio`) or sign-in (`/login`). Reachable while logged out —
 * the session proxy whitelists `/`.
 */
export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <Faq />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ---------------------------------------------------------------- header --- */

function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-md supports-backdrop-filter:bg-card/70">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={28} />
          <span className="font-display text-lg font-bold">WauxAiStudio</span>
        </Link>
        <nav className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <GithubLink />
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/studio">
              Open studio
              <ArrowRight />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ hero --- */

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <GridDecor />
      {/* Faint brand watermark behind the hero content — monochrome outline
          (sparkle + "W", no badge background) in the foreground tone. Anchored
          to the right edge and vertically centred, oversized and bleeding off
          to the right so the star + "W" frame the node-chain column. */}
      <Logo
        mono
        size={950}
        aria-hidden
        className="pointer-events-none absolute top-1/2 -right-28 z-0 -translate-y-1/2 -rotate-45 text-foreground opacity-[0.05] dark:opacity-[0.09]"
      />
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div className="flex flex-col items-start gap-6">
          <h1 className="font-display text-5xl font-bold leading-[1.04] sm:text-6xl">
            Build tools as visual node chains.
          </h1>

          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            WauxAiStudio lets you compose tools as a top-to-bottom chain of
            input, logic, and output nodes — with a live, interactive preview.
            No backend, no boilerplate.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-12 px-7 text-base">
              <Link href="/studio">
                Start building
                <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-7 text-base"
            >
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>

        <NodeChain />
      </div>
    </section>
  );
}

/** The three product nodes, rendered as a connected vertical chain. */
function NodeChain() {
  const nodes = [
    { label: "Text input", marker: "bg-ring", rotate: "-1.5deg" },
    { label: "Transform with AI", marker: "bg-primary", rotate: "1.5deg" },
    { label: "Live preview", marker: "bg-chart-4", rotate: "-1deg" },
  ] as const;

  return (
    <div
      className="relative mx-auto hidden w-full max-w-xs flex-col items-center gap-5 lg:flex"
      aria-hidden
    >
      {/* Continuous spine behind the cards. Cards have an opaque bg, so the line
          only shows through the gaps — the per-card rotation can't break it. */}
      <span className="absolute inset-y-6 left-1/2 z-0 w-0.5 -translate-x-1/2 bg-foreground" />

      {nodes.map((node) => (
        <div
          key={node.label}
          className="node-card nb-surface relative z-10 flex w-full items-center gap-3 bg-card px-4 py-3.5"
          style={{ "--r": node.rotate } as CSSProperties}
        >
          <span
            className={cn(
              "size-3.5 shrink-0 border-2 border-foreground",
              node.marker,
            )}
          />
          <span className="font-display text-sm font-bold">{node.label}</span>
          <span className="ml-auto flex gap-1">
            <span className="size-1.5 rounded-full bg-muted-foreground/40" />
            <span className="size-1.5 rounded-full bg-muted-foreground/40" />
          </span>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- features --- */

const FEATURES = [
  {
    icon: Workflow,
    tint: "bg-chart-3/10",
    iconColor: "text-chart-3",
    title: "Node-chain editor",
    body: "Drag input, logic, and output nodes into a clear top-to-bottom flow. Every tool reads like a recipe.",
  },
  {
    icon: Eye,
    tint: "bg-chart-4/10",
    iconColor: "text-chart-4",
    title: "Live preview",
    body: "See results as you build. The preview pane runs your chain instantly on every change — no deploy step.",
  },
  {
    icon: Sparkles,
    tint: "bg-chart-5/10",
    iconColor: "text-chart-5",
    title: "AI-powered nodes",
    body: "Drop in AI transform nodes with your own key. Summarize, classify, rewrite, or generate inside any chain.",
  },
  {
    icon: Zap,
    tint: "bg-chart-1/10",
    iconColor: "text-chart-1",
    title: "No backend required",
    body: "Tools run in the browser. Bring an API key when you need one — there is nothing to host or maintain.",
  },
  {
    icon: Share2,
    tint: "bg-chart-2/10",
    iconColor: "text-chart-2",
    title: "Share with a link",
    body: "Publish any tool as a public share link. Anyone can use it — no account, no setup on their side.",
  },
  {
    icon: GitBranch,
    tint: "bg-ring/10",
    iconColor: "text-ring",
    title: "17+ node types",
    body: "Inputs, logic, website and site-proxy nodes, and more — composed into whatever workflow you need.",
  },
] as const;

function Features() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mb-12 flex flex-col gap-3">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Everything you need to ship a tool.
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            From the first input to the shared link, WauxAiStudio keeps the
            whole loop in one place.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, tint, iconColor, title, body }) => (
            <article
              key={title}
              className="nb-surface flex flex-col gap-3 bg-card p-6"
            >
              <span
                className={cn(
                  "inline-flex size-11 items-center justify-center rounded-lg",
                  tint,
                )}
              >
                <Icon className={cn("size-5", iconColor)} />
              </span>
              <h3 className="font-display text-lg font-bold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- how-it-works -- */

const STEPS = [
  {
    n: "01",
    title: "Add an input",
    body: "Start the chain with text, a number, a file, or a website to pull data from.",
  },
  {
    n: "02",
    title: "Chain your logic",
    body: "Stack transform, AI, and logic nodes. Each node feeds the next, top to bottom.",
  },
  {
    n: "03",
    title: "Preview & share",
    body: "Watch it run live, then publish a share link so anyone can use your tool.",
  },
] as const;

function HowItWorks() {
  return (
    <section className="border-b border-border bg-secondary">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <h2 className="mb-12 font-display text-3xl font-bold sm:text-4xl">
          Three steps from idea to tool.
        </h2>
        <div className="flex flex-col items-stretch gap-4 md:flex-row md:gap-3">
          {STEPS.map((step, i) => (
            <Fragment key={step.n}>
              <div className="nb-surface flex flex-1 flex-col gap-3 bg-card p-6">
                <span className="font-display text-4xl font-bold text-primary">
                  {step.n}
                </span>
                <h3 className="font-display text-lg font-bold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
              {/* Flow connector — points down between stacked cards, right
                  between side-by-side cards. Decorative. */}
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden
                  className="flex shrink-0 items-center justify-center text-primary"
                >
                  <FlowArrowIcon className="h-7 w-20 rotate-90 md:rotate-0" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- faq --- */

const FAQS = [
  {
    q: "What is WauxAiStudio?",
    a: "A visual tool builder. You compose tools as a top-to-bottom chain of input, logic, and output nodes, and watch them run in a live preview — no setup, no deploy step.",
  },
  {
    q: "Do I need to know how to code?",
    a: "Not to get started. Most tools are built visually by connecting nodes — and when you want more control, code-friendly nodes (logic, transforms, code views) are right there in the chain.",
  },
  {
    q: "Is there really no backend?",
    a: "Right. Tools run entirely in your browser. There is nothing to host or maintain — you only bring an API key for the nodes that need one, like the AI nodes.",
  },
  {
    q: "How do the AI nodes work — do I need an API key?",
    a: "AI nodes call your chosen provider using your own key. The key is stored in your browser and used to talk to the provider directly; it is never sent to our servers.",
  },
  {
    q: "Which AI providers and models can I use?",
    a: "Pick Gemini or OpenRouter and choose your model. Your selection is saved to your account and reused across every tool you build.",
  },
  {
    q: "What kinds of nodes are available?",
    a: "17+ node types: inputs (text, number, file, CSV/Excel, website), logic and transform nodes, AI nodes, and outputs like tables, charts, code views, QR codes, and text-to-speech.",
  },
  {
    q: "Can I share the tools I build?",
    a: "Yes. Publish any tool as a public share link and anyone can use it — no account and no setup on their side. You can also collect tools into a public gallery.",
  },
  {
    q: "Where is my data stored?",
    a: "Your tools are saved to your account so they follow you between sessions. The data flowing through a tool is processed locally in your browser as you build.",
  },
  {
    q: "What languages does the interface support?",
    a: "English and Burmese (Myanmar). Switch the language anytime from Settings — the whole app shell updates instantly.",
  },
  {
    q: "How do I get started?",
    a: "Open the studio, add your first input node, and start chaining. You can have a working tool in a couple of minutes — no install required.",
  },
] as const;

function Faq() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-3xl px-6 py-20">
        <div className="mb-12 flex flex-col items-center gap-3 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Everything you need to know about building tools with WauxAiStudio.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="nb-surface group bg-card px-5 transition-colors hover:border-primary/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-base font-bold [&::-webkit-details-marker]:hidden">
                {faq.q}
                <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform duration-(--motion-duration-fast) group-open:rotate-180" />
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- cta band --- */

function CtaBand() {
  return (
    <section className="border-b border-border">
      <div className="w-full px-6 py-20 sm:px-10 lg:px-16">
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-linear-to-br from-neutral-950 to-neutral-800 px-8 py-16 text-center text-white shadow-nb-lg">
          {/* faint dotted grid texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "radial-gradient(white 1.2px, transparent 1.2px)",
              backgroundSize: "22px 22px",
            }}
          />
          {/* faint brand watermark */}
          <Logo
            mono
            size={420}
            aria-hidden
            className="pointer-events-none absolute right-6 -bottom-24  text-white opacity-[0.1]"
          />

          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* dot motif eyebrow — echoes the node markers + flow connector */}
            <span aria-hidden className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-white/40" />
              <span className="size-1.5 rounded-full bg-white/70" />
              <span className="size-1.5 rounded-full bg-white" />
            </span>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Build your first tool in minutes.
            </h2>
            <p className="max-w-xl text-white/90">
              Open the studio and start chaining nodes. No install, no setup.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-12 border-white bg-white px-7 text-base text-neutral-900 hover:bg-white/90"
            >
              <Link href="/studio">
                Open the studio
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- footer --- */

function SiteFooter() {
  return (
    <footer className="bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <Link
          href="/"
          aria-label="WauxAiStudio — home"
          className="flex items-center gap-2 rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Logo size={22} />
          <span className="font-display text-sm font-bold">WauxAiStudio</span>
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms &amp; Conditions
          </Link>
          <GithubLink />
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ decor -- */

/**
 * Animated hero backdrop: a slowly panning dotted grid with a few brutalist
 * shapes drifting over it. Pure decoration — pointer-events off, aria-hidden,
 * and frozen by the global `prefers-reduced-motion` rule.
 */
function GridDecor() {
  const shapes = [
    {
      className: "left-[8%] top-[18%] size-16 bg-primary",
      rot: "-12deg",
      dur: "11s",
      delay: "0s",
    },
    {
      className: "right-[12%] top-[12%] size-10 rounded-full bg-chart-4",
      rot: "0deg",
      dur: "9s",
      delay: "1.2s",
    },
    {
      className: "left-[22%] bottom-[14%] size-12 bg-ring",
      rot: "18deg",
      dur: "13s",
      delay: "0.6s",
    },
    {
      className: "right-[18%] bottom-[20%] size-14 rounded-full bg-chart-3",
      rot: "0deg",
      dur: "10s",
      delay: "2s",
    },
    {
      className: "right-[32%] top-[44%] size-8 bg-chart-5",
      rot: "24deg",
      dur: "8s",
      delay: "0.3s",
    },
  ] as const;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {/* Panning dotted grid. */}
      <div
        className="animate-grid-pan absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(var(--foreground) 1.2px, transparent 1.2px)",
          backgroundSize: "26px 26px",
        }}
      />
      {/* Drifting brutalist shapes. */}
      {shapes.map((s, i) => (
        <span
          key={i}
          className={cn(
            "animate-float absolute border border-border opacity-[0.15]",
            s.className,
          )}
          style={
            {
              "--nb-float-rot": s.rot,
              "--nb-float-dur": s.dur,
              "--nb-float-delay": s.delay,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
