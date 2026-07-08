"use client";

import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ListTodo,
  Loader2,
  Plus,
  SendHorizontal,
  Sparkles,
  Square,
  Upload,
  Wand2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { PlannerQuickAdd } from "@/components/customs/PlannerQuickAdd";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/ui/markdown";
import { ModelCombobox } from "@/components/ui/model-combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  buildChatSystemPrompt,
  PROMPT_ENHANCER_SYSTEM_PROMPT,
} from "@/constants/ai-prompts";
import { uuid } from "@/constants/tool-builder";
import { NodeDetailDialog } from "@/features/NodeDocs/components/NodeDetailDialog";
import { useChatModelPref } from "@/hooks/useChatModelPref";
import { useProviderModels } from "@/hooks/useProviderModels";
import { useToolBuilder } from "@/hooks/useToolBuilder";
import { useTranslation } from "@/hooks/useTranslation";
import {
  callGemini,
  callOpenRouter,
  type ChatMessage,
} from "@/lib/ai-providers";
import {
  buildChatToolContext,
  parseBuildSpec,
  planFromSpec,
  type PlanProposal,
  validateTool,
} from "@/lib/chat-context";
import { type PlannerReference } from "@/lib/planner-bridge";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/hooks";
import type {
  AiProvider,
  BuildSpec,
  StateNode,
  Tool,
  ToolNodeType,
} from "@/types/tool-builder";

/** One turn in the transcript. */
interface ChatItem {
  id: string;
  role: "user" | "assistant";
  text: string;
  /** Control message (confirm / cancel / self-fix): sent to the model but not shown. */
  hidden?: boolean;
}

/** Max root-cause fix passes the user can trigger per build before it's capped. */
const MAX_SELF_FIX = 100;

/**
 * Where a build is in its lifecycle once a plan is approved:
 * - `building` — adding the planned nodes; the checklist ticks live.
 * - `review`   — done; asking the user whether the result is correct.
 * - `fixing`   — user said "No"; running a root-cause fix against the plan.
 * - `null`     — idle (ordinary chat).
 */
type BuildPhase = "building" | "review" | "fixing" | null;

/** Default model per provider — the value used until the user picks another. */
const DEFAULT_MODELS: Record<AiProvider, string> = {
  gemini: "gemini-2.5-flash",
  openrouter: "openrouter/auto",
};

/** Human label per provider (proper nouns — not translated). */
const PROVIDER_LABELS: Record<AiProvider, string> = {
  gemini: "Gemini",
  openrouter: "OpenRouter",
};

/** i18n keys for the empty-state suggestion chips, in display order. */
const SUGGESTIONS = [
  "chat.suggest.1",
  "chat.suggest.2",
  "chat.suggest.3",
] as const;

/** Rotating "thinking…" phrases cycled while a reply is in flight. */
const THINKING_KEYS = [
  "chat.thinking.1",
  "chat.thinking.2",
  "chat.thinking.3",
  "chat.thinking.4",
  "chat.thinking.5",
  "chat.thinking.6",
  "chat.thinking.7",
  "chat.thinking.8",
  "chat.thinking.9",
  "chat.thinking.10",
] as const;

/** How long (ms) each rotating "thinking…" phrase stays before the next. */
const THINKING_ROTATE_MS = 2000;

/**
 * Recover a plan from an assistant reply that contains the propose_plan args as
 * raw JSON instead of an actual tool call — weaker models (e.g. free OpenRouter
 * models) often emit the tool call as text. Scans fenced blocks and the first
 * `{…}` span for an object with a `summary` + non-empty `steps`.
 *
 * @param text - The assistant's reply text.
 * @returns The parsed plan, or null when the reply isn't a plan dump.
 */
function extractPlanFromText(text: string): PlanProposal | null {
  if (!text) {
    return null;
  }
  const candidates: string[] = [];
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    candidates.push(fence[1]);
  }
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first !== -1 && last > first) {
    candidates.push(text.slice(first, last + 1));
  }
  for (const c of candidates) {
    try {
      const obj = JSON.parse(c) as {
        summary?: unknown;
        slots?: unknown;
        steps?: unknown;
      };
      if (
        typeof obj.summary === "string" &&
        obj.summary.trim() &&
        Array.isArray(obj.steps) &&
        obj.steps.length > 0
      ) {
        return {
          summary: obj.summary.trim(),
          slots: Array.isArray(obj.slots) ? obj.slots.map(String) : [],
          steps: obj.steps.map((s) =>
            String(s)
              .replace(/^\s*\d+[.)]\s*/, "")
              .trim(),
          ),
        };
      }
    } catch {
      // Not valid JSON / not a plan — try the next candidate.
    }
  }
  return null;
}

/**
 * Render a recovered plan as a readable chat message (summary, slots, numbered
 * steps) with an approve prompt, replacing the raw JSON the model emitted.
 *
 * @param plan - The recovered plan.
 * @param t - Translator.
 */
function formatPlanMessage(
  plan: PlanProposal,
  t: ReturnType<typeof useTranslation>["t"],
): string {
  const slots = plan.slots.length
    ? `**${t("chat.plan.slots")}:** ${plan.slots.join(", ")}\n\n`
    : "";
  const steps = plan.steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
  return `${plan.summary}\n\n${slots}**${t("chat.plan.steps")}:**\n${steps}\n\n${t("chat.plan.askApprove")}`;
}

/**
 * Affirmative-reply matcher for chat-based plan approval. True when the user's
 * short reply clearly means "go ahead and build" — English or Burmese — so a
 * pending plan can be confirmed without a button. Long messages never match;
 * they're treated as new instructions, not a yes.
 *
 * @param text - The user's raw message.
 */
function isAffirmative(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 40) {
    return false;
  }
  const en =
    /^(y|ya|yes+|yep|yeah|yup|ok|okay|k|sure|go|go ahead|do it|build|build it|let'?s build|confirm(ed)?|proceed|continue|approve[d]?|lgtm|looks good|sounds good|create it|make it|build the plan)\b/;
  const my = /(ဟုတ်|ဆောက်|အတည်ပြု|လုပ်ပါ|ရပါ|သွား)/;
  return en.test(trimmed.toLowerCase()) || my.test(trimmed);
}

/** Trigger a client-side download of `content` as a Markdown file. */
function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * ChatGPT-style assistant for the Builder panel's "chat" tab.
 *
 * Sends the conversation to the chosen provider (Gemini / OpenRouter, keys from
 * the AI-keys popover in the Tools panel) with a system prompt that grounds the
 * model in the **open tool**: its connected node chain, the full node catalog,
 * and in-depth docs for the node types in use — so users can ask what is wired
 * and how each node works. The prompt is assembled by `buildChatSystemPrompt`
 * ({@link "@/constants/ai-prompts"}) from data gathered by
 * {@link buildChatToolContext}; internal ids never reach the model.
 *
 * Shows a centred greeting + suggestion chips while empty, a scrolling
 * transcript of user (right) / assistant (left) bubbles, a thinking indicator
 * mid-request, and a pinned auto-growing composer. Neobrutalism styling + motion
 * tokens; honours the user `data-reduced-motion` setting.
 *
 * @param props.tool - The open tool, grounding context for the assistant.
 * @param props.stateNode - The tool's State Control node (for binding subtitles).
 * @param props.active - Whether the chat tab is the visible center view.
 * @param props.onUnread - Called when a reply arrives while the tab is hidden.
 */
export function ChatView({
  tool,
  stateNode,
  active = true,
  onUnread,
}: {
  tool: Tool;
  stateNode: StateNode | null;
  active?: boolean;
  onUnread?: () => void;
}) {
  const { t } = useTranslation();

  // Latest-value refs so the async reply handler reads current props without
  // widening runAssistant's deps (it would rebuild on every active toggle).
  const activeRef = useRef(active);
  activeRef.current = active;
  const onUnreadRef = useRef(onUnread);
  onUnreadRef.current = onUnread;

  // The whole tool is rebuilt atomically from the model's JSON spec via
  // applyBuildSpec; `store` is read afterwards to validate the result.
  const store = useAppStore();
  const { applyBuildSpec } = useToolBuilder();
  // Plan-confirm gate: a build request first parks a plan here for the user to
  // approve; the build spec is only applied after they reply to approve.
  const [pendingPlan, setPendingPlan] = useState<PlanProposal | null>(null);
  // When the model emits a build spec early (skipping the plan step), we stash
  // it here, show its derived plan instead of the raw JSON, and apply it
  // directly on approval — no second model call.
  const pendingSpecRef = useRef<BuildSpec | null>(null);
  // The plan being built — kept past confirmation so the post-build review can
  // compare against it. `selfFixCount` caps the user-triggered fix passes.
  const confirmedPlanRef = useRef<PlanProposal | null>(null);
  const selfFixCountRef = useRef(0);
  // The confirmed plan, kept visible through the whole build → review → fix
  // lifecycle so the user always sees the SAME plan they approved.
  const [buildPlan, setBuildPlan] = useState<PlanProposal | null>(null);
  // Where we are in that lifecycle (see {@link BuildPhase}).
  const [buildPhase, setBuildPhase] = useState<BuildPhase>(null);
  // Node type whose docs are open in a modal — set by clicking an @slug in a
  // reply, cleared when the dialog closes.
  const [docType, setDocType] = useState<ToolNodeType | null>(null);

  /** Fresh snapshot of the open tool, straight from the store. */
  const getOpenTool = useCallback((): Tool | null => {
    const s = store.getState().toolBuilder;
    return s.tools.find((tl) => tl.id === s.selectedToolId) ?? null;
  }, [store]);

  /**
   * Apply a build spec to the open tool atomically, then return the assistant
   * message to show — a success line, or a warning line listing any dead wires
   * found by {@link validateTool} for the user to fix.
   */
  const applyBuiltSpec = useCallback(
    (spec: BuildSpec): string => {
      applyBuildSpec(spec);
      const built = getOpenTool();
      const count = built?.nodes.length ?? 0;
      const issues = validateTool(built);
      return issues.length
        ? `${t("chat.build.warnings", { n: issues.length })}\n\n${issues
            .map((w) => `- ${w}`)
            .join("\n")}`
        : t("chat.build.done", { n: count });
    },
    [applyBuildSpec, getOpenTool, t],
  );

  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [input, setInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  // Planner tasks picked via PlannerQuickAdd — shown as removable chips above
  // the composer, not dumped into the draft text. Their content is folded
  // into the outgoing message only when the user actually sends.
  const [plannerRefs, setPlannerRefs] = useState<PlannerReference[]>([]);
  // Provider + model are a global per-user preference (persisted on profiles).
  const { provider, model: savedModel, save: savePref } = useChatModelPref();
  const model = savedModel ?? DEFAULT_MODELS[provider];
  const [sending, setSending] = useState(false);
  // Prompt-enhancer ("Enhance" button): rewrites the composer text in place via
  // a one-shot model call, independent of the main send request.
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const providerModels = useProviderModels(provider);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const enhanceAbortRef = useRef<AbortController | null>(null);
  // Turn kind of the last request, so retry() repeats build vs chat correctly.
  const lastExpectSpecRef = useRef(false);

  const empty = messages.length === 0;

  // Abort any in-flight request when the view unmounts.
  useEffect(
    () => () => {
      abortRef.current?.abort();
      enhanceAbortRef.current?.abort();
    },
    [],
  );

  // Keep the latest message in view as the transcript grows / thinking shows.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    const reduced = document.documentElement.hasAttribute(
      "data-reduced-motion",
    );
    el.scrollTo({
      top: el.scrollHeight,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [messages, sending]);

  /** Reset the composer textarea back to its single-row height. */
  function resetComposerHeight() {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
    }
  }

  /** Switch provider and reset the model to that provider's default. */
  function handleProviderChange(next: AiProvider) {
    savePref({ provider: next, model: DEFAULT_MODELS[next] });
  }

  /**
   * Send `history` (ending with the latest user turn) to the active provider
   * and handle the reply. Two turn kinds, no tool-calling:
   *
   * - `expectSpec` false (chat / plan turn): show the reply; if it carries a
   *   build plan (JSON or recovered from text), park it as the pending plan so
   *   an affirmative reply triggers the build.
   * - `expectSpec` true (build / fix turn): parse the single JSON build spec the
   *   model emits, apply it to the open tool atomically, then move to review.
   *
   * @param history - Transcript ending with the turn to answer.
   * @param expectSpec - Whether this turn must return a build spec.
   */
  const runAssistant = useCallback(
    async (history: ChatItem[], expectSpec = false) => {
      // Remember the turn kind so a retry after a failure repeats it correctly.
      lastExpectSpecRef.current = expectSpec;
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      setError(null);
      setSending(true);

      const system = buildChatSystemPrompt(
        buildChatToolContext(tool, stateNode),
      );
      const apiMessages: ChatMessage[] = [
        { role: "system", content: system },
        ...history.map((m) => ({ role: m.role, content: m.text })),
      ];
      const opts = {
        messages: apiMessages,
        model: model || undefined,
        signal: ac.signal,
      };

      try {
        const reply =
          provider === "openrouter"
            ? await callOpenRouter(opts)
            : await callGemini(opts);

        if (expectSpec) {
          // Build / fix turn: apply the JSON spec the model returned. Empty
          // `nodes` is valid here — it's an approved "clear all nodes" build.
          const spec = parseBuildSpec(reply, true);
          if (!spec) {
            setError(t("chat.error.spec"));
            setBuildPhase(null);
            setBuildPlan(null);
            confirmedPlanRef.current = null;
            return;
          }
          const text = applyBuiltSpec(spec);
          setMessages([...history, { id: uuid(), role: "assistant", text }]);
          if (!activeRef.current) {
            onUnreadRef.current?.();
          }
          setBuildPhase("review");
          return;
        }

        // Chat / plan turn: never show a raw build spec. If the model jumped
        // straight to a spec (skipping the plan step), intercept it — stash it,
        // and show its derived plan for approval instead of the JSON. Otherwise
        // recover a plan from the reply, or just render the prose answer.
        let displayText = reply || "…";
        const spec = parseBuildSpec(reply);
        if (spec) {
          const plan = planFromSpec(spec);
          pendingSpecRef.current = spec;
          setPendingPlan(plan);
          displayText = formatPlanMessage(plan, t);
        } else {
          pendingSpecRef.current = null;
          const recovered = extractPlanFromText(reply);
          if (recovered) {
            setPendingPlan(recovered);
            displayText = formatPlanMessage(recovered, t);
          }
        }
        setMessages([
          ...history,
          { id: uuid(), role: "assistant", text: displayText },
        ]);
        if (!activeRef.current) {
          onUnreadRef.current?.();
        }
      } catch (e) {
        if (ac.signal.aborted) {
          return;
        }
        const msg = e instanceof Error ? e.message : String(e);
        setError(
          /missing apikey/i.test(msg)
            ? t("chat.error.noKey", { provider: PROVIDER_LABELS[provider] })
            : t("chat.error.generic"),
        );
        // A build/fix turn failed — drop the build UI so the user can retry.
        if (expectSpec) {
          setBuildPhase(null);
          setBuildPlan(null);
          confirmedPlanRef.current = null;
        }
      } finally {
        if (!ac.signal.aborted) {
          setSending(false);
        }
      }
    },
    [tool, stateNode, model, provider, t, applyBuiltSpec],
  );

  /** Append the user's message and request a reply. No-ops while blank/sending. */
  function send(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed || sending) {
      return;
    }
    setInput("");
    resetComposerHeight();
    // Fold any referenced Planner tasks into the outgoing message (not the
    // draft textarea — those only ever showed as chips above the composer).
    // The affirmative check below runs against the plain typed text so an
    // attached reference can't accidentally break "yes"/"looks good" replies.
    const refBlock = plannerRefs.length
      ? "\n\n" +
        plannerRefs
          .map(
            (r) =>
              `[Planner: "${r.title}" (${r.fileName})]${r.thought ? `\n${r.thought}` : " — no notes"}`,
          )
          .join("\n\n")
      : "";
    const text = trimmed + refBlock;
    setPlannerRefs([]);
    // A pending plan is approved by an affirmative chat reply: keep the SAME
    // plan on screen and build it.
    if (pendingPlan && isAffirmative(trimmed)) {
      startBuild(pendingPlan, text);
      return;
    }
    // Any other message is a new request: drop a pending plan + its stashed spec
    // and any in-flight build review so nothing builds without fresh approval.
    if (pendingPlan) {
      setPendingPlan(null);
      pendingSpecRef.current = null;
    }
    if (buildPhase) {
      setBuildPhase(null);
      setBuildPlan(null);
      confirmedPlanRef.current = null;
    }
    const history: ChatItem[] = [
      ...messages,
      { id: uuid(), role: "user", text },
    ];
    setMessages(history);
    void runAssistant(history);
  }

  /**
   * Rewrite the current composer text into a clearer prompt (for building a tool
   * or asking a question) via a one-shot model call, then drop the result back
   * into the composer for the user to review and send. No-ops while blank or
   * while a send/enhance is already in flight. Uses its own AbortController so
   * it never disturbs the main chat request.
   */
  async function enhance() {
    const text = input.trim();
    if (!text || sending || enhancing) {
      return;
    }
    enhanceAbortRef.current?.abort();
    const ac = new AbortController();
    enhanceAbortRef.current = ac;
    setError(null);
    setEnhancing(true);
    try {
      const opts = {
        messages: [
          { role: "system" as const, content: PROMPT_ENHANCER_SYSTEM_PROMPT },
          { role: "user" as const, content: text },
        ],
        model: model || undefined,
        signal: ac.signal,
      };
      const reply =
        provider === "openrouter"
          ? await callOpenRouter(opts)
          : await callGemini(opts);
      const improved = reply.trim();
      if (improved) {
        setInput(improved);
        // Refocus the composer on the next frame (it auto-sizes via CSS).
        requestAnimationFrame(() => textareaRef.current?.focus());
      }
    } catch (e) {
      if (!ac.signal.aborted) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(
          /missing apikey/i.test(msg)
            ? t("chat.error.noKey", { provider: PROVIDER_LABELS[provider] })
            : t("chat.enhance.error"),
        );
      }
    } finally {
      if (!ac.signal.aborted) {
        setEnhancing(false);
      }
    }
  }

  /** Re-send the last user turn after a failed attempt (same turn kind). */
  function retry() {
    if (sending || messages.at(-1)?.role !== "user") {
      return;
    }
    void runAssistant(messages, lastExpectSpecRef.current);
  }

  /** Stop the in-flight request and tear down the build lifecycle. */
  function stop() {
    abortRef.current?.abort();
    setSending(false);
    pendingSpecRef.current = null;
    confirmedPlanRef.current = null;
    setBuildPlan(null);
    setBuildPhase(null);
  }

  /**
   * Approve a pending plan, keeping the SAME plan on screen. When the model
   * already returned the build spec (stashed early, gun-jumping the plan step),
   * apply it directly — no second model call. Otherwise ask the model for the
   * spec via a build turn. `userText` is the user's approval message.
   */
  function startBuild(plan: PlanProposal, userText: string) {
    setPendingPlan(null);
    // Remember the plan + reset the fix budget so a later review can fix it.
    confirmedPlanRef.current = plan;
    selfFixCountRef.current = 0;
    setBuildPlan(plan);

    // Fast path: the spec is already in hand — apply it and go straight to review.
    const stashed = pendingSpecRef.current;
    if (stashed) {
      pendingSpecRef.current = null;
      const text = applyBuiltSpec(stashed);
      setMessages([
        ...messages,
        { id: uuid(), role: "user", text: userText },
        { id: uuid(), role: "assistant", text },
      ]);
      setBuildPhase("review");
      return;
    }

    // Otherwise run a build turn: hidden directive tells the model the plan is
    // approved and to emit ONLY the JSON build spec (a bare "yes" sometimes
    // makes it restate the plan instead).
    setBuildPhase("building");
    const planText = `${plan.summary}\n${plan.steps
      .map((s, i) => `${i + 1}. ${s}`)
      .join("\n")}`;
    const history: ChatItem[] = [
      ...messages,
      { id: uuid(), role: "user", text: userText },
      {
        id: uuid(),
        role: "user",
        text: t("chat.plan.confirmed", { plan: planText }),
        hidden: true,
      },
    ];
    setMessages(history);
    void runAssistant(history, true);
  }

  /** Review: user confirms the build is correct — end the build lifecycle. */
  function acceptBuild() {
    if (sending) {
      return;
    }
    setBuildPhase(null);
    setBuildPlan(null);
    confirmedPlanRef.current = null;
  }

  /**
   * Review: user reports the build is wrong. Reopen the gate and run a hidden
   * root-cause fix turn against the approved plan; the result returns to review.
   *
   * @param comment - Optional user feedback describing what's wrong. When
   *   present it's shown in the transcript (so the user sees what they asked
   *   for) and woven into the hidden fix directive to steer the fix pass.
   */
  function rejectBuild(comment?: string) {
    const plan = confirmedPlanRef.current;
    if (sending || !plan || selfFixCountRef.current >= MAX_SELF_FIX) {
      return;
    }
    selfFixCountRef.current += 1;
    setBuildPhase("fixing");
    const planText = `${plan.summary}\n${plan.steps
      .map((s, i) => `${i + 1}. ${s}`)
      .join("\n")}`;
    const feedback = comment?.trim();
    const fixText = feedback
      ? `${t("chat.review.fixRequest")} ${t("chat.review.feedback", {
          comment: feedback,
        })} ${t("chat.plan.selfFix", { plan: planText })}`
      : `${t("chat.review.fixRequest")} ${t("chat.plan.selfFix", {
          plan: planText,
        })}`;
    const history: ChatItem[] = [
      ...messages,
      // Show the user's feedback in the transcript when they gave any.
      ...(feedback
        ? [{ id: uuid(), role: "user" as const, text: feedback }]
        : []),
      {
        id: uuid(),
        role: "user",
        text: fixText,
        hidden: true,
      },
    ];
    setMessages(history);
    void runAssistant(history, true);
  }

  /** Clear the transcript and cancel any in-flight request. */
  function newChat() {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setSending(false);
    setPendingPlan(null);
    pendingSpecRef.current = null;
    confirmedPlanRef.current = null;
    selfFixCountRef.current = 0;
    setBuildPlan(null);
    setBuildPhase(null);
  }

  /** Section heading used in exported Markdown for a given role. */
  const roleHeading = (role: ChatItem["role"]) =>
    role === "user" ? t("chat.you") : t("chat.assistant");

  /**
   * Serialize the visible transcript to Markdown. Hidden control messages
   * (confirm/cancel/self-fix) are excluded so it mirrors exactly what the
   * user sees in the chat. Returns `null` when there's nothing to save yet.
   * Shared by {@link exportChat} (file download) and the "save this
   * conversation" checkbox in {@link PlannerQuickAdd} (Planner task notes).
   */
  const buildTranscriptMarkdown = useCallback((): string | null => {
    const visible = messages.filter((m) => !m.hidden);
    if (visible.length === 0) {
      return null;
    }
    return (
      `# ${t("chat.greeting")}\n\n` +
      visible.map((m) => `## ${roleHeading(m.role)}\n\n${m.text}`).join("\n\n")
    );
  }, [messages, roleHeading, t]);

  /**
   * Trigger a client-side download of {@link buildTranscriptMarkdown}. The
   * same format is read back by {@link importChat}.
   */
  function exportChat() {
    const md = buildTranscriptMarkdown();
    if (!md) {
      return;
    }
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    downloadText(`chat-${ts}.md`, md);
  }

  /**
   * Parse a Markdown chat export back into transcript turns. Splits on `## `
   * headings; a heading matching the "You" label is a user turn, anything else
   * (e.g. "Assistant") is an assistant turn. The leading `# …` title is ignored.
   *
   * @param md - Raw Markdown file contents.
   * @returns Parsed turns, or an empty array when nothing usable is found.
   */
  function parseChatMarkdown(md: string): ChatItem[] {
    const userLabel = t("chat.you").trim().toLowerCase();
    const out: ChatItem[] = [];
    // Split on H2 headings, keeping the heading text via a capture group.
    const parts = md.split(/^##[ \t]+(.+)$/m);
    // parts[0] is the preamble (title) before the first heading; then pairs of
    // [headingText, body] follow.
    for (let i = 1; i < parts.length; i += 2) {
      const heading = parts[i].trim().toLowerCase();
      const text = parts[i + 1]?.trim() ?? "";
      if (!text) {
        continue;
      }
      out.push({
        id: uuid(),
        role: heading === userLabel ? "user" : "assistant",
        text,
      });
    }
    return out;
  }

  /** Load a chat from a Markdown file the user picks, replacing the transcript. */
  /**
   * Reset any in-flight build/plan state and replace the transcript with
   * `parsed`. Shared by the file-based {@link importChat} and importing a
   * conversation saved on a Planner task (`PlannerQuickAdd`).
   */
  function loadTranscript(parsed: ChatItem[]) {
    abortRef.current?.abort();
    setSending(false);
    setPendingPlan(null);
    pendingSpecRef.current = null;
    confirmedPlanRef.current = null;
    selfFixCountRef.current = 0;
    setBuildPlan(null);
    setBuildPhase(null);
    setError(null);
    setMessages(parsed);
  }

  /** Parse a Planner task's saved conversation and load it, replacing the current chat. */
  function importFromPlanner(markdown: string) {
    const parsed = parseChatMarkdown(markdown);
    if (parsed.length === 0) {
      setError(t("chat.import.error"));
      return;
    }
    loadTranscript(parsed);
  }

  async function importChat(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-importing the same file later
    if (!file) {
      return;
    }
    try {
      const parsed = parseChatMarkdown(await file.text());
      if (parsed.length === 0) {
        setError(t("chat.import.error"));
        return;
      }
      loadTranscript(parsed);
    } catch {
      setError(t("chat.import.error"));
    }
  }

  /** Enter sends; Shift+Enter inserts a newline. */
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <NodeDetailDialog type={docType} onClose={() => setDocType(null)} />
      <div className="flex shrink-0 items-center gap-2 border-b-2 border-foreground px-3 py-2.5">
        <Select
          value={provider}
          onValueChange={(v) => handleProviderChange(v as AiProvider)}
        >
          <SelectTrigger
            size="sm"
            aria-label={t("chat.provider")}
            className="h-7 w-auto gap-1 text-xs"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gemini">Gemini</SelectItem>
            <SelectItem value="openrouter">OpenRouter</SelectItem>
          </SelectContent>
        </Select>
        <div className="min-w-0 flex-1 sm:max-w-56">
          <ModelCombobox
            value={model}
            onChange={(m) => savePref({ provider, model: m })}
            options={providerModels}
            placeholder={DEFAULT_MODELS[provider]}
            size="sm"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown,text/markdown,text/plain"
            className="hidden"
            onChange={importChat}
          />
          <Button
            type="button"
            variant="outline"
            size="xs"
            title={t("chat.import.title")}
            aria-label={t("chat.import.title")}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload />
            {t("chat.import")}
          </Button>
          {!empty && (
            <>
              <Button
                type="button"
                variant="outline"
                size="xs"
                title={t("chat.export.title")}
                aria-label={t("chat.export.title")}
                onClick={exportChat}
              >
                <Download />
                {t("chat.export")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={newChat}
              >
                <Plus />
                {t("chat.newChat")}
              </Button>
            </>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto">
        <div className="mx-auto max-w-4xl p-4 sm:p-6">
          {empty ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="grid size-12 place-items-center border-2 border-foreground bg-primary text-primary-foreground shadow-nb">
                <Sparkles size={24} />
              </span>
              <h2 className="font-display text-lg font-bold">
                {t("chat.greeting")}
              </h2>
              <p className="max-w-xs text-sm text-muted-foreground">
                {t("chat.subtitle")}
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => send(t(key))}
                    className="nb-press border-2 border-foreground bg-card px-3 py-1.5 text-xs font-bold shadow-nb-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    {t(key)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages
                .filter((m) => !m.hidden)
                .map((message) => (
                  <MessageRow
                    key={message.id}
                    message={message}
                    t={t}
                    onNodeClick={setDocType}
                  />
                ))}
              {sending && <ThinkingRow t={t} />}
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t-2 border-foreground bg-background p-3 sm:p-4">
        <div className="mx-auto max-w-4xl">
          {buildPhase === "fixing" && <FixingCard t={t} />}
          {buildPlan && buildPhase === "review" && (
            <BuildReviewCard
              disabled={sending}
              onAccept={acceptBuild}
              onReject={rejectBuild}
              t={t}
            />
          )}
          {error && (
            <div className="mb-2 flex items-center gap-2 border-2 border-destructive bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              <AlertTriangle size={14} className="shrink-0" />
              <span className="min-w-0 flex-1">{error}</span>
              {messages.at(-1)?.role === "user" && (
                <button
                  type="button"
                  onClick={retry}
                  className="shrink-0 font-bold underline underline-offset-2"
                >
                  {t("chat.retry")}
                </button>
              )}
            </div>
          )}
          <div className="flex flex-col gap-2 border-2 border-foreground bg-card p-2 shadow-nb focus-within:ring-2 focus-within:ring-ring/50">
            {plannerRefs.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {plannerRefs.map((ref) => (
                  <span
                    key={ref.todoId}
                    className="inline-flex max-w-56 items-center gap-1.5 border-2 border-foreground bg-accent px-2 py-1 text-xs font-bold text-accent-foreground shadow-nb-sm"
                  >
                    <ListTodo className="size-3 shrink-0" />
                    <span className="truncate">{ref.title}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setPlannerRefs((prev) =>
                          prev.filter((r) => r.todoId !== ref.todoId),
                        )
                      }
                      aria-label={`Remove reference: ${ref.title}`}
                      className="shrink-0 rounded-sm hover:opacity-70"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <PlannerQuickAdd
                onReference={(ref) =>
                  setPlannerRefs((prev) =>
                    prev.some((r) => r.todoId === ref.todoId)
                      ? prev
                      : [...prev, ref],
                  )
                }
                getTranscript={buildTranscriptMarkdown}
                onImport={importFromPlanner}
              />
              <div className="relative flex-1">
                {!input.trim() && (
                  <AnimatedPlaceholder t={t} animate={!inputFocused} />
                )}
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  aria-label={t("chat.placeholder")}
                  className="field-sizing-content max-h-40 min-h-9 w-full resize-none content-center bg-transparent px-1.5 py-1.5 pb-0 text-sm leading-5 outline-none"
                />
              </div>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={enhance}
                disabled={!input.trim() || sending || enhancing}
                title={t("chat.enhance.title")}
                aria-label={enhancing ? t("chat.enhancing") : t("chat.enhance")}
              >
                {enhancing ? <Loader2 className="animate-spin" /> : <Wand2 />}
              </Button>
              {sending ? (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={stop}
                  aria-label={t("chat.stop")}
                >
                  <Square className="fill-current" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="icon"
                  onClick={() => send(input)}
                  disabled={!input.trim()}
                  aria-label={t("chat.send")}
                >
                  <SendHorizontal />
                </Button>
              )}
            </div>
          </div>
          <p className="mt-1.5 px-1 text-[11px] text-muted-foreground">
            {t("chat.hint")}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * A single transcript row. Assistant messages sit left with an avatar chip;
 * user messages sit right in a filled bubble. Enters with a token-timed
 * fade/slide that is frozen under reduced motion.
 *
 * @param props.message - The message to render.
 * @param props.t - Translator for the role label.
 * @param props.onNodeClick - Opens a node's docs when its `@slug` is clicked.
 */
function MessageRow({
  message,
  t,
  onNodeClick,
}: {
  message: ChatItem;
  t: ReturnType<typeof useTranslation>["t"];
  onNodeClick?: (type: ToolNodeType) => void;
}) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  // Stamped once when the row first mounts — the moment the message appeared.
  const [stamp] = useState(() => new Date());
  const timeLabel = stamp.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  /** Copy the raw message text and briefly flip the icon to a check. */
  async function copy() {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked (permissions / insecure context) — ignore.
    }
  }

  /** Download just this message as a standalone Markdown file. */
  function download() {
    const heading = isUser ? t("chat.you") : t("chat.assistant");
    const ts = stamp.toISOString().slice(0, 19).replace(/[:T]/g, "-");
    downloadText(
      `${message.role}-${ts}.md`,
      `## ${heading}\n\n${message.text}`,
    );
  }

  return (
    <div
      className={cn(
        "flex animate-in gap-2.5 fade-in slide-in-from-bottom-2 duration-(--motion-duration-base) [html[data-reduced-motion]_&]:animate-none",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      {!isUser && (
        <span className="grid size-8 shrink-0 place-items-center border-2 border-foreground bg-primary text-primary-foreground shadow-nb-sm">
          <Sparkles size={15} />
        </span>
      )}
      <div
        className={cn(
          "flex min-w-0 flex-col gap-1",
          isUser ? "max-w-[80%]" : "flex-1",
        )}
      >
        <span
          className={cn(
            "text-[11px] font-bold text-muted-foreground",
            isUser ? "text-right" : "text-left",
          )}
        >
          {isUser ? t("chat.you") : t("chat.assistant")}
        </span>
        <div
          className={cn(
            "prose prose-sm max-w-none px-3 py-2 text-sm wrap-break-word *:first:mt-0 *:last:mb-0",
            // The user bubble sits on the yellow `primary` fill, but the
            // typography plugin hardcodes gray `--tw-prose-*` colors (bullets,
            // list numbers, bold, code, headings) tuned for a light surface, so
            // they render faint here. Pin every prose color to `currentColor`
            // (= primary-foreground) so all Markdown stays legible on the fill.
            isUser
              ? "border-2 border-foreground bg-primary text-primary-foreground shadow-nb-sm [--tw-prose-body:currentColor] [--tw-prose-headings:currentColor] [--tw-prose-bold:currentColor] [--tw-prose-counters:currentColor] [--tw-prose-bullets:currentColor] [--tw-prose-code:currentColor] [--tw-prose-quotes:currentColor] [--tw-prose-quote-borders:currentColor] [--tw-prose-links:currentColor] [--tw-prose-hr:currentColor] [--tw-prose-captions:currentColor] [--tw-prose-th-borders:currentColor] [--tw-prose-td-borders:currentColor]"
              : "text-card-foreground dark:prose-invert",
          )}
        >
          <Markdown content={message.text} onNodeClick={onNodeClick} />
        </div>
        {!isUser && (
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>{timeLabel}</span>
            <button
              type="button"
              onClick={copy}
              title={t(copied ? "chat.copied" : "chat.copy")}
              aria-label={t(copied ? "chat.copied" : "chat.copy")}
              className="inline-flex items-center gap-1 font-medium transition-colors hover:text-foreground"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {t(copied ? "chat.copied" : "chat.copy")}
            </button>
            <button
              type="button"
              onClick={download}
              title={t("chat.download")}
              aria-label={t("chat.download")}
              className="inline-flex items-center gap-1 font-medium transition-colors hover:text-foreground"
            >
              <Download size={12} />
              {t("chat.download")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Assistant-side placeholder shown while a reply is in flight: avatar chip plus
 * a spinner and a rotating "thinking…" phrase. Starts on a random phrase and
 * advances every {@link THINKING_ROTATE_MS} with a fade, so long waits feel
 * alive; under reduced motion it holds a single random phrase (no rotation).
 *
 * @param props.t - Translator for the localized phrases.
 */
function ThinkingRow({ t }: { t: ReturnType<typeof useTranslation>["t"] }) {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * THINKING_KEYS.length),
  );

  useEffect(() => {
    if (document.documentElement.hasAttribute("data-reduced-motion")) {
      return;
    }
    const id = window.setInterval(() => {
      // Step to a different random phrase each tick (never repeat in place).
      setIndex(
        (i) =>
          (i + 1 + Math.floor(Math.random() * (THINKING_KEYS.length - 1))) %
          THINKING_KEYS.length,
      );
    }, THINKING_ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex animate-in gap-2.5 fade-in duration-(--motion-duration-base) [html[data-reduced-motion]_&]:animate-none">
      <span className="grid size-8 shrink-0 place-items-center border-2 border-foreground bg-primary text-primary-foreground shadow-nb-sm">
        <Sparkles size={15} />
      </span>
      <div className="inline-flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
        <Loader2 size={14} className="animate-spin" />
        <span
          key={index}
          className="animate-in fade-in slide-in-from-bottom-1 duration-(--motion-duration-base) [html[data-reduced-motion]_&]:animate-none"
        >
          {t(THINKING_KEYS[index])}
        </span>
      </div>
    </div>
  );
}

/**
 * Shown while the assistant runs a root-cause fix after the user clicks
 * "No, fix it" on the review card.
 *
 * @param props.t - Translator.
 */
function FixingCard({ t }: { t: ReturnType<typeof useTranslation>["t"] }) {
  return (
    <div className="mb-2 flex items-center gap-2 border-2 border-foreground bg-amber-50 p-3 text-sm font-bold shadow-nb-sm dark:bg-amber-500/10">
      <Loader2 size={15} className="shrink-0 animate-spin" />
      {t("chat.review.fixing")}
    </div>
  );
}

/**
 * Post-build approval card: the build is done, so ask the user whether it is
 * correct. "Yes" ends the build; "No" triggers an automatic root-cause fix pass
 * against the approved plan, after which the user is asked again. The comment
 * box lets the user describe what's wrong; "Continue" runs the fix with that
 * feedback woven into the directive.
 *
 * @param props.disabled - Disable the actions while a request is in flight.
 * @param props.onAccept - User confirms the build is correct.
 * @param props.onReject - User reports the build is wrong → fix it. Receives the
 *   optional feedback comment.
 * @param props.t - Translator.
 */
function BuildReviewCard({
  disabled,
  onAccept,
  onReject,
  t,
}: {
  disabled: boolean;
  onAccept: () => void;
  onReject: (comment?: string) => void;
  t: ReturnType<typeof useTranslation>["t"];
}) {
  const [comment, setComment] = useState("");
  const trimmed = comment.trim();
  return (
    <div className="mb-2 border-2 border-foreground bg-card p-3 shadow-nb-sm">
      <div className="flex items-center gap-2">
        <CheckCircle2 size={15} className="shrink-0 text-primary" />
        <span className="text-sm font-bold">{t("chat.review.title")}</span>
      </div>
      <p className="mt-1.5 text-sm">{t("chat.review.body")}</p>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        disabled={disabled}
        placeholder={t("chat.review.commentPlaceholder")}
        aria-label={t("chat.review.commentPlaceholder")}
        className="mt-3 max-h-40 min-h-8 w-full resize-none border-2 border-foreground bg-background px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
      />
      <p className="mt-1 text-xs text-muted-foreground">
        {t("chat.review.commentHint")}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          onClick={onAccept}
          disabled={disabled}
          title={t("chat.review.yesHint")}
        >
          {t("chat.review.yes")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onReject(trimmed || undefined)}
          disabled={disabled}
          title={
            trimmed ? t("chat.review.continueHint") : t("chat.review.noHint")
          }
        >
          {trimmed ? t("chat.review.continue") : t("chat.review.no")}
        </Button>
      </div>
    </div>
  );
}

const PLACEHOLDER_KEYS = [
  "chat.placeholder.1",
  "chat.placeholder.2",
  "chat.placeholder.3",
  "chat.placeholder.4",
  "chat.placeholder.5",
] as const;

/**
 * Typewriter overlay rendered above the chat textarea while it is empty.
 * Cycles through example prompts, typing each one out, holding, then deleting
 * before moving to the next. Honors `prefers-reduced-motion` by falling back to
 * the static base placeholder. Purely decorative (`aria-hidden`) — the textarea
 * keeps its own `aria-label` for screen readers.
 */
function AnimatedPlaceholder({
  t,
  animate,
}: {
  t: ReturnType<typeof useTranslation>["t"];
  animate: boolean;
}) {
  const phrasesKey = PLACEHOLDER_KEYS.map((k) => t(k)).join("");
  const [text, setText] = useState("");
  const [reduced, setReduced] = useState(false);
  const still = reduced || !animate;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (still) {
      setText("");
      return;
    }
    const phrases = phrasesKey.split("");
    let phrase = 0;
    let char = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = phrases[phrase];
      if (!deleting) {
        char++;
        setText(current.slice(0, char));
        if (char >= current.length) {
          deleting = true;
          timer = setTimeout(tick, 1800); // hold the full phrase
          return;
        }
        timer = setTimeout(tick, 55);
      } else {
        char--;
        setText(current.slice(0, char));
        if (char <= 0) {
          deleting = false;
          phrase = (phrase + 1) % phrases.length;
          timer = setTimeout(tick, 350);
          return;
        }
        timer = setTimeout(tick, 28);
      }
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [still, phrasesKey]);

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center px-1.5 py-1.5 text-sm text-muted-foreground"
    >
      <span className="truncate">{still ? t("chat.placeholder") : text}</span>
      {!still && (
        <span className="ml-0.5 inline-block h-3.5 w-px shrink-0 animate-pulse bg-muted-foreground" />
      )}
    </span>
  );
}
