"use client";

import { Boxes, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

import { signIn, signUp } from "./actions";

type Mode = "signin" | "signup";
type ViewState = "form" | "check-email";

/**
 * Full-page authentication form supporting email/password sign-in and sign-up.
 *
 * Server actions (`signIn` / `signUp`) call Supabase Auth and redirect on
 * success; this component only manages local UI state (mode toggle, loading,
 * error, password visibility).
 */
export function AuthLogin() {
  const [mode, setMode] = useState<Mode>("signin");
  const [view, setView] = useState<ViewState>("form");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData(e.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    const result =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(email, password);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      setView("check-email");
      setLoading(false);
    }
    // sign-in: server action calls redirect(), so loading stays true until nav.
  }

  function toggleMode() {
    setMode((m) => (m === "signin" ? "signup" : "signin"));
    setError(null);
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
            {view === "check-email"
              ? "Check your email"
              : mode === "signin"
                ? "Sign in to your workspace"
                : "Create your account"}
          </p>
        </div>

        {view === "check-email" ? (
          <CheckEmailState
            onBackToSignIn={() => {
              setView("form");
              setMode("signin");
            }}
          />
        ) : (
          <>
            {/* Form card */}
            <form
              onSubmit={handleSubmit}
              className="nb-surface space-y-4 rounded-md bg-card p-6"
            >
              {/* Email */}
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
                  placeholder="you@gmail.com"
                  autoFocus
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

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                  {mode === "signin" && (
                    <Link
                      href="/forgot-password"
                      className={cn(
                        "text-xs font-medium text-muted-foreground underline-offset-4",
                        "hover:text-foreground hover:underline",
                        "transition-colors duration-[--motion-duration-fast]",
                        "rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      )}
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete={
                      mode === "signin" ? "current-password" : "new-password"
                    }
                    placeholder="••••••••"
                    minLength={6}
                    className={cn(
                      "h-10 w-full rounded-md border-2 border-foreground bg-background py-2 pl-3 pr-10 text-sm text-foreground",
                      "placeholder:text-muted-foreground",
                      "transition-shadow duration-[--motion-duration-fast]",
                      "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      "disabled:opacity-50",
                    )}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((v) => !v)}
                    className={cn(
                      "absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center text-muted-foreground",
                      "hover:text-foreground",
                      "transition-colors duration-[--motion-duration-fast]",
                      "rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    )}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
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

              {/* Submit */}
              <Button
                type="submit"
                className={cn(
                  "w-full transition-transform duration-[--motion-duration-instant]",
                  "active:scale-[0.98]",
                )}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {mode === "signin" ? "Signing in…" : "Creating account…"}
                  </>
                ) : mode === "signin" ? (
                  "Sign in"
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            {/* Mode toggle */}
            <p className="text-center text-sm text-muted-foreground">
              {mode === "signin"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={toggleMode}
                className={cn(
                  "font-medium text-foreground underline-offset-4",
                  "hover:underline",
                  "transition-colors duration-[--motion-duration-fast]",
                  "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded",
                )}
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </>
        )}

        {/* Legal — sign-in/up implies acceptance. Links open the public
            Privacy / Terms pages in a new tab so the form state is preserved. */}
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          By continuing, you agree to our
          <br />
          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "font-medium text-foreground underline-offset-4 hover:underline",
              "rounded outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            )}
          >
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "font-medium text-foreground underline-offset-4 hover:underline",
              "rounded outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            )}
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function CheckEmailState({ onBackToSignIn }: { onBackToSignIn: () => void }) {
  return (
    <div
      className={cn(
        "nb-surface space-y-4 rounded-md bg-card p-6 text-center",
        "animate-in fade-in slide-in-from-bottom-1 duration-[--motion-duration-base]",
      )}
    >
      <div className="mx-auto grid size-12 place-items-center rounded-md border-2 border-foreground bg-primary">
        <Boxes className="size-5 text-primary-foreground" />
      </div>
      <div className="space-y-1">
        <p className="font-medium text-foreground">Confirm your email</p>
        <p className="text-sm text-muted-foreground">
          We sent a confirmation link to your inbox. Click it to activate your
          account and sign in.
        </p>
      </div>
      <Button variant="outline" className="w-full" onClick={onBackToSignIn}>
        Back to sign in
      </Button>
    </div>
  );
}
