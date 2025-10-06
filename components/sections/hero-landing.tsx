import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function HeroLanding() {
  return (
    <section className="space-y-8 py-16 sm:py-24 lg:py-28">
      <div className="container flex max-w-4xl flex-col items-center text-center">
        <span className="mb-3 rounded-full bg-[hsl(262,81%,58%,0.1)] px-4 py-1.5 text-sm font-medium text-[hsl(262,81%,58%)]">
          🚀 Smarter Invoicing Starts Here (Beta)
        </span>

        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Create, manage, and send invoices
          <br />
          <span className="text-gradient_indigo-purple font-extrabold">
            faster with AI.
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
          Simplify your client billing with InvoiceBoard — the modern AI-powered
          invoicing tool that saves you time and keeps everything organized.
        </p>

        <div className="mt-8 flex justify-center space-x-2 md:space-x-4">
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "lg", rounded: "full" }),
              "gap-2",
            )}
          >
            Get Started
          </Link>
          <Link
            href="/ai-assistant"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
                rounded: "full",
              }),
              "px-5",
            )}
          >
            Try It Now
          </Link>
        </div>
      </div>
    </section>
  );
}
