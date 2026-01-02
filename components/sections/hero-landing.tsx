"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react"; // Assuming you have lucide-react installed

// Keeping your original imports
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function HeroLanding() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    // Simulate API delay - Replace this with your actual DB/API call
    setTimeout(() => {
      console.log("User joined waitlist:", email);
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <section className="space-y-8 py-16 sm:py-24 lg:py-28">
      <div className="container mx-auto flex max-w-4xl flex-col items-center px-4 text-center">
        {/* Badge */}
        <span className="mb-3 rounded-full bg-[hsl(262,81%,58%,0.1)] px-4 py-1.5 text-sm font-medium text-[hsl(262,81%,58%)] duration-1000 animate-in fade-in slide-in-from-bottom-3">
          🚀 Smarter Invoicing Starts Here
        </span>

        {/* Headline */}
        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Create Invoices at the
          <br />
          <span className="text-gradient_indigo-purple font-extrabold text-[hsl(262,81%,58%)]">
            Speed of Thought.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-5 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
          Stop manually filling out rows and columns. Simply type a request, and
          InvoiceBoard’s AI generates professional, tax-ready invoices, tracks
          payments, and chases clients for you.
        </p>

        {/* Waitlist Form */}
        <div className="mt-8 w-full xl:max-w-sm">
          {status === "success" ? (
            <div className="rounded-md border border-green-200 bg-green-50 p-4 text-center text-green-800 animate-in zoom-in-95">
              <p className="font-semibold">You're on the list! 🚀</p>
              <p className="text-sm">
                We'll notify you when early access opens.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:flex-row sm:gap-3"
            >
              <input
                type="email"
                required
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="flex h-11 w-full rounded-full border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className={cn(
                  buttonVariants({ size: "lg", rounded: "full" }),
                  "w-full min-w-[140px] shrink-0 gap-2 whitespace-nowrap sm:w-auto",
                )}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Waitlist"
                )}
              </button>
            </form>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Get early access + 14 days free on launch.
          </p>
        </div>
      </div>
    </section>
  );
}
