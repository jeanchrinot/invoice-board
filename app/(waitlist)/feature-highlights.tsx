import Link from "next/link";
import {
  ArrowUpRight,
  BellRing,
  CreditCard,
  Globe,
  LayoutDashboard,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// Re-using the HeaderSection pattern locally to ensure it works standalone
interface HeaderSectionProps {
  label?: string;
  title: string;
  subtitle?: string;
}

function HeaderSection({ label, title, subtitle }: HeaderSectionProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {label ? (
        <div className="text-gradient_indigo-purple mb-4 font-semibold">
          {label}
        </div>
      ) : null}
      <h2 className="font-heading text-3xl font-bold md:text-4xl lg:text-[40px]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

const features = [
  {
    title: "AI-Powered Drafting",
    description:
      "Forget forms. Just type 'Bill Acme $500 for design' and watch the perfect invoice appear instantly.",
    icon: Sparkles,
  },
  {
    title: "Smart Reminders",
    description:
      "We chase payments so you don't have to. Set up polite, automated follow-ups for overdue bills.",
    icon: BellRing,
  },
  {
    title: "Magic Payment Links",
    description:
      "Don't just send a PDF. Send a secure link where clients can view, download, and pay in seconds.",
    icon: CreditCard,
  },
  {
    title: "Quote-to-Invoice",
    description:
      "Client approved the estimate? Turn that quote into a final invoice with a single click.",
    icon: RefreshCw,
  },
  {
    title: "Financial Homeboard",
    description:
      "See who owes you what, instantly. A visual dashboard that acts as mission control for your revenue.",
    icon: LayoutDashboard,
  },
  {
    title: "Global & Tax Ready",
    description:
      "Working with international clients? We handle multi-currency conversion and tax calculations automatically.",
    icon: Globe,
  },
];

export default function FeatureHighlights() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <HeaderSection
          label="Features"
          title="Everything you need to get paid."
          subtitle="InvoiceBoard gathers invoicing, reminders, and payments into a single, smart board."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                className="group relative overflow-hidden rounded-2xl border bg-background/50 p-5 transition-colors duration-300 hover:border-primary/50 md:p-8"
                key={feature.title}
              >
                {/* Gradient Glow Effect on Hover - Updated to Green/Teal */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-emerald-500/80 to-teal-500/80 opacity-0 blur-2xl duration-300 group-hover:-translate-y-1/4 group-hover:opacity-15 dark:from-emerald-400 dark:to-teal-600 dark:opacity-0 dark:group-hover:opacity-20"
                />

                <div className="relative">
                  <div className="relative flex size-12 items-center justify-center rounded-2xl border border-border bg-muted/20 shadow-sm">
                    <Icon className="size-6 text-primary" />
                  </div>

                  <h3 className="mt-4 text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-2 pb-6 leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
