"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Logo } from "@/components/ui/logo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const PLANNER_URL = process.env.NEXT_PUBLIC_PLANNER_URL;

/**
 * Slim full-height rail on the far left of the studio for jumping between the
 * sibling wauxai apps. Collapsible: expanded shows icon + label, collapsed
 * shows icon-only with a tooltip on hover. Toolkits' own icon is an internal
 * `Link` (no full reload); the planner icon is a real cross-origin redirect,
 * so its target comes from an env var rather than being hardcoded.
 */
export function AppSwitcherRail() {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex shrink-0 flex-col gap-1 border-r-2 border-foreground bg-card py-3 transition-[width] duration-200",
          open ? "w-44 px-2" : "w-12 items-center px-0",
        )}
      >
        {open ? (
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Collapse"
            className="nb-press flex items-center gap-2 rounded-md p-1.5 text-sm font-bold text-muted-foreground"
          >
            <ChevronLeft className="size-4" />
            Collapse
          </button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Expand"
                className="nb-press flex items-center justify-center rounded-md p-1.5 text-muted-foreground"
              >
                <ChevronRight className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand</TooltipContent>
          </Tooltip>
        )}

        <RailLink
          open={open}
          href="/"
          label="WauxAiStudio"
          icon={<Logo size={26} />}
        />
        {PLANNER_URL && (
          <RailLink
            open={open}
            href={PLANNER_URL}
            label="Planner"
             
            icon={
              <img src="/planner-logo.svg" alt="" className="size-[26px]" />
            }
            external
          />
        )}
      </div>
    </TooltipProvider>
  );
}

function RailLink({
  open,
  href,
  label,
  icon,
  external,
}: {
  open: boolean;
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
}) {
  if (open) {
    const content = (
      <>
        {icon}
        <span className="truncate text-sm font-bold">{label}</span>
      </>
    );
    return external ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="nb-press flex items-center gap-2 rounded-md p-1.5 opacity-70 hover:opacity-100"
      >
        {content}
      </a>
    ) : (
      <Link
        href={href}
        aria-label={label}
        className="nb-press flex items-center gap-2 rounded-md p-1.5"
      >
        {content}
      </Link>
    );
  }

  const trigger = external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="nb-press flex items-center justify-center rounded-md p-1.5 opacity-70 hover:opacity-100"
    >
      {icon}
    </a>
  ) : (
    <Link
      href={href}
      aria-label={label}
      className="nb-press flex items-center justify-center rounded-md p-1.5"
    >
      {icon}
    </Link>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
