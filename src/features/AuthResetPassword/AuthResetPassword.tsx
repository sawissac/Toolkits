"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { updatePassword } from "@/features/AuthLogin/actions";
import { cn } from "@/lib/utils";

/**
 * Set-a-new-password page. Reached only via `/auth/callback`, which establishes
 * the recovery session. Submits to `updatePassword`, which redirects to `/` on
 * success. Local UI state only (visibility, loading, error).
 */
export function AuthResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const data = new FormData(e.currentTarget);
    const password = data.get("password") as string;
    const confirm = data.get("confirm") as string;

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    // success: server action calls redirect(), so loading stays true until nav.
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
          <p className="text-sm text-muted-foreground">Set a new password</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="nb-surface space-y-4 rounded-md bg-card p-6"
        >
          {/* New password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              New password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                autoFocus
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
                aria-label={showPassword ? "Hide password" : "Show password"}
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

          {/* Confirm password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirm"
              className="text-sm font-medium text-foreground"
            >
              Confirm password
            </label>
            <input
              id="confirm"
              name="confirm"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              minLength={6}
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
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Updating password…
              </>
            ) : (
              "Update password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
