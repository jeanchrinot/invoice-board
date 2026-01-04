"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface WaitlistFormProps {
  className?: string;
  variant?: "hero" | "cta";
}

export function WaitlistForm({
  className,
  variant = "hero",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !agreed) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed");

      setStatus("success");
      setEmail("");
      setAgreed(false);
    } catch (error) {
      console.error(error);
      setStatus("idle"); // or handle error state
    }

    // Simulate API delay - Replace with actual API call
    // setTimeout(() => {
    //   setStatus("success");
    //   setEmail("");
    //   setAgreed(false);
    // }, 1500);
  };

  if (status === "success") {
    return (
      <div className="rounded-xl border border-primary/20 p-4 text-center text-green-600 animate-in zoom-in-95 dark:text-green-400">
        <p className="font-semibold">You're on the list! 🚀</p>
        <p className="text-sm opacity-90">Watch your inbox for updates.</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-sm space-y-4", className)}>
      <form onSubmit={handleSubmit} className="relative space-y-4">
        <div className="relative flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            className={cn(
              "h-12 w-full rounded-full border border-input bg-background/80 px-4 py-2 text-sm ring-offset-background backdrop-blur-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              variant === "cta" && "bg-background/90",
            )}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className={cn(
              buttonVariants({ size: "lg", rounded: "full" }),
              "w-full shrink-0 gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 sm:w-auto",
            )}
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Join Waitlist <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {/* Terms Confirmation */}
        <div className="flex items-center justify-center gap-2 px-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            id={`terms-${variant}`}
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded border-primary text-primary focus:ring-primary"
          />
          <label
            htmlFor={`terms-${variant}`}
            className="cursor-pointer select-none"
          >
            I agree to the{" "}
            <a href="/terms" target="_blank">
              terms
            </a>{" "}
            and{" "}
            <a href="/terms" target="_blank">
              privacy policy
            </a>
            .
          </label>
        </div>
      </form>

      {/* <p className="text-xs text-muted-foreground">
        Get early access + 3 months free on launch.
      </p> */}
      <p className="mx-auto mt-6 max-w-xl text-sm text-muted-foreground">
        Get early access +{" "}
        <span className="font-medium text-foreground">14 days free</span> on
        launch.
      </p>
    </div>
  );
}
