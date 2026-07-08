"use client";

import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { requestPasswordReset } from "@/features/AuthLogin/actions";
import { cn } from "@/lib/utils";

type ViewState = "form" | "sent";

/**
 * Request-a-password-reset page. Submits an email to `requestPasswordReset`,
 * which sends a Supabase recovery link, then shows a confirmation state.
 * Local UI state only (view, loading, error).
 */
export function AuthForgotPassword() {
  const [view, setView] = useState<ViewState>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData(e.currentTarget);
    const email = data.get("email") as string;

    const result = await requestPasswordReset(email);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setView("sent");
    setLoading(false);
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div
        className={cn(
          "w-full max-w-sm space-y-8",
          "animate-in fade-in zoom-in-95 slide-in-from-bottom-2",
          "duration-[--motion-duration-slow] ease-[--motion-ease-standard]",
        )}
      >
        {/* Wordmark */}
        <div className="space-y-1 text-center">
          <Link
            href="/"
            aria-label="WauxAiStudio — home"
            className="inline-flex items-center justify-center gap-2 rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <Logo size={32} />
            <span className="font-display text-lg font-semibold">
              WauxAiStudio
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            {view === "sent" ? "Check your email" : "Reset your password"}
          </p>
        </div>

        {view === "sent" ? (
          <div
            className={cn(
              "nb-surface space-y-4 rounded-md bg-card p-6 text-center",
              "animate-in fade-in slide-in-from-bottom-1 duration-[--motion-duration-base]",
            )}
          >
            <div className="mx-auto grid size-12 place-items-center rounded-md border-2 border-foreground bg-primary">
              <MailCheck className="size-5 text-primary-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">Reset link sent</p>
              <p className="text-sm text-muted-foreground">
                If an account exists for that email, we sent a link to reset
                your password. Check your inbox.
              </p>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">Back to sign in</Link>
            </Button>
          </div>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              className="nb-surface space-y-4 rounded-md bg-card p-6"
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  autoFocus
                  placeholder="you@gmail.com"
                  className={cn(
                    "h-10 w-full rounded-md border-2 border-foreground bg-background px-3 text-sm text-foreground",
                    "placeholder:text-muted-foreground",
                    "transition-shadow duration-[--motion-duration-fast]",
                    "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    "disabled:opacity-50",
                  )}
                  disabled={loading}
                />
              </div>

              {error && (
                <p
                  role="alert"
                  aria-live="polite"
                  className={cn(
                    "rounded-md border-2 border-destructive bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive",
                    "animate-in fade-in slide-in-from-top-1 duration-[--motion-duration-base]",
                  )}
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className={cn(
                  "w-full transition-transform duration-[--motion-duration-instant]",
                  "active:scale-[0.98]",
                )}
                disabled={loading}
              >
                {loading ? "Sending link…" : "Send reset link"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Remember it?{" "}
              <Link
                href="/login"
                className={cn(
                  "font-medium text-foreground underline-offset-4",
                  "hover:underline",
                  "transition-colors duration-[--motion-duration-fast]",
                  "rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                )}
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
