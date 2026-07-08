"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Eye, EyeOff, KeyRound } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Logo } from "@/components/ui/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { PreviewPane } from "@/features/PreviewPane";
import type { AiProvider, StateNode, Tool } from "@/types/tool-builder";

async function fetchSharedTool(toolId: string): Promise<Tool> {
  const res = await fetch(`/api/shared/${toolId}`);
  if (!res.ok) {
    throw new Error("not_found");
  }
  return res.json();
}

const LS_KEY: Record<AiProvider, string> = {
  gemini: "GEMINI_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
};

const PROVIDER_LABEL: Record<AiProvider, string> = {
  gemini: "Gemini API Key",
  openrouter: "OpenRouter API Key",
};

const PROVIDERS: AiProvider[] = ["gemini", "openrouter"];

function readKey(provider: AiProvider): string {
  if (typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem(LS_KEY[provider]) ?? "";
}

function writeKey(provider: AiProvider, value: string) {
  if (value) {
    localStorage.setItem(LS_KEY[provider], value);
  } else {
    localStorage.removeItem(LS_KEY[provider]);
  }
}

/**
 * Public share view — shows only the live preview for the given tool.
 * No builder UI is rendered; visitors can use the tool but not edit it.
 *
 * A key icon in the header opens the API key setup dialog so visitors
 * can supply provider keys before running AI-powered tools. Keys are
 * stored in localStorage and never sent to the server.
 *
 * @param props.toolId - The tool UUID from the share URL.
 */
export function SharedToolView({ toolId }: { toolId: string }) {
  const {
    data: tool,
    isLoading,
    isError,
  } = useQuery<Tool>({
    queryKey: ["shared-tool", toolId],
    queryFn: () => fetchSharedTool(toolId),
    retry: false,
  });

  const stateNode: StateNode | null = useMemo(
    () => (tool?.nodes.find((n) => n.type === "state") as StateNode) ?? null,
    [tool],
  );

  const [keysOpen, setKeysOpen] = useState(false);
  const [keys, setKeys] = useState<Record<string, string>>(() =>
    Object.fromEntries(PROVIDERS.map((p) => [p, readKey(p)])),
  );
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  const handleKeyChange = (provider: AiProvider, value: string) => {
    writeKey(provider, value);
    setKeys((prev) => ({ ...prev, [provider]: value }));
  };

  const inputCls =
    "h-9 w-full border-2 border-foreground bg-transparent pl-3 pr-10 text-sm shadow-nb-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-mono";

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b-2 border-foreground bg-card px-4">
        <Link
          href="/"
          aria-label="WauxAiStudio — home"
          className="shrink-0 rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Logo size={24} title="WauxAiStudio" />
        </Link>
        <span className="flex-1 truncate text-sm font-bold">
          {isLoading ? (
            <Skeleton className="inline-block h-4 w-32 border-0" />
          ) : tool ? (
            tool.name
          ) : (
            "Tool"
          )}
        </span>
        <button
          type="button"
          onClick={() => setKeysOpen(true)}
          title="API key setup"
          aria-label="API key setup"
          className="nb-press grid size-8 shrink-0 place-items-center border-2 border-foreground bg-card text-foreground shadow-nb-sm"
        >
          <KeyRound size={15} />
        </button>
      </header>

      <main className="flex flex-1 justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3 shadow-nb-sm" />
              <Skeleton className="h-24 w-full shadow-nb-sm" />
              <Skeleton className="h-10 w-full shadow-nb-sm" />
              <Skeleton className="h-32 w-full shadow-nb-sm" />
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center gap-3 border-2 border-dashed border-destructive py-16 text-center text-sm text-muted-foreground">
              <AlertTriangle size={24} className="text-destructive" />
              <span>
                This tool is not available or the share link is invalid.
              </span>
            </div>
          )}

          {tool && <PreviewPane tool={tool} stateNode={stateNode} />}
        </div>
      </main>

      <footer className="flex h-10 shrink-0 items-center justify-center border-t-2 border-foreground bg-card">
        <span className="text-xs text-muted-foreground/50">
          Built with WauxAiStudio
        </span>
      </footer>

      <Dialog open={keysOpen} onOpenChange={setKeysOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound size={15} />
              API Key Setup
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-1">
            {PROVIDERS.map((provider) => (
              <div key={provider} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">
                  {PROVIDER_LABEL[provider]}
                </label>
                <div className="relative">
                  <input
                    type={visible[provider] ? "text" : "password"}
                    value={keys[provider]}
                    placeholder="Paste your key here…"
                    onChange={(e) => handleKeyChange(provider, e.target.value)}
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setVisible((prev) => ({
                        ...prev,
                        [provider]: !prev[provider],
                      }))
                    }
                    aria-label={visible[provider] ? "Hide key" : "Show key"}
                    className="absolute inset-y-0 right-0 grid w-9 place-items-center text-muted-foreground hover:text-foreground"
                  >
                    {visible[provider] ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>
              </div>
            ))}
            <p className="text-[11px] text-muted-foreground/70">
              Keys are saved in your browser only and never sent to our servers.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
