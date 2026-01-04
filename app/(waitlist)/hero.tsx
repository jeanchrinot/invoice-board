"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import { WaitlistForm } from "./waitlist-form";

export default function HeroLanding() {
  return (
    <section className="space-y-8 py-16 sm:py-24 lg:py-28">
      <div className="container mx-auto flex max-w-4xl flex-col items-center px-4 text-center">
        {/* Badge */}

        <span className="mb-3 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary duration-1000 animate-in fade-in slide-in-from-bottom-3">
          🚀 Smarter Invoicing Starts Here
        </span>

        {/* Headline */}

        <h1 className="text-balance font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Create Invoices at the
          <br />
          <span className="font-extrabold text-primary">Speed of Thought.</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-5 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
          Stop manually filling out rows and columns. Simply type a request, and
          InvoiceBoard's AI generates professional, tax-ready invoices, tracks
          payments, and chases clients for you.
        </p>

        {/* Waitlist Form Component */}
        <div className="mt-8 flex w-full justify-center">
          <WaitlistForm variant="hero" />
        </div>
      </div>
    </section>
  );
}
