"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import { WaitlistForm } from "./waitlist-form";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32" id="waitlist">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 opacity-20 blur-[120px]" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Ready to simplify your billing?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Join the waitlist today and be the first to experience the future of
          freelance finance.
        </p>

        <div className="mx-auto mt-10 flex justify-center">
          <WaitlistForm variant="cta" />
        </div>

        {/* <p className="mt-8 text-sm text-muted-foreground">
          No credit card required. Unsubscribe at any time.
        </p> */}
      </div>
    </section>
  );
}
