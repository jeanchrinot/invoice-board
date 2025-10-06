"use client";

import React from "react";
import Link from "next/link";
import { useAssistantStore } from "@/stores/assistantStore";
import {
  AlertTriangle,
  Crown,
  Rocket,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function UpgradeCard() {
  const { usage } = useAssistantStore();
  const { usageLimit, planName } = useUser();

  const isTokenLimitReached = useAssistantStore((s) =>
    s.isTokenLimitReached(usageLimit),
  );

  const isInvoiceLimitReached = useAssistantStore((s) =>
    s.isInvoiceLimitReached(usageLimit),
  );

  const invoiceProgress = Math.min(
    (usage.invoices / usageLimit.invoices) * 100,
    100,
  );
  const tokenProgress = Math.min((usage.tokens / usageLimit.tokens) * 100, 100);

  const reachedAnyLimit = isTokenLimitReached || isInvoiceLimitReached;

  const nextPlan =
    planName === "Free" ? "Pro" : planName === "Pro" ? "Business" : null;

  return (
    <Card className="md:max-xl:rounded-none md:max-xl:border-none md:max-xl:shadow-none">
      <CardHeader className="space-y-1 p-3 pb-3 md:p-4">
        <div className="flex items-center gap-2">
          {planName === "Free" && (
            <Sparkles className="size-4 text-[hsl(262_81%_58%)]" />
          )}
          {planName === "Pro" && (
            <Crown className="size-4 text-[hsl(262_81%_58%)]" />
          )}
          {planName === "Business" && (
            <Crown className="size-4 text-[hsl(262_81%_58%)]" />
          )}

          <CardTitle className="text-md font-semibold">
            {planName} Plan
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Here’s your usage
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 p-3 pt-0 md:p-4">
        {/* Usage Progress */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">
                Invoices
              </span>
              <span
                className={`font-semibold ${
                  isInvoiceLimitReached
                    ? "text-red-600"
                    : "text-muted-foreground"
                }`}
              >
                {usage.invoices}/{usageLimit.invoices}
              </span>
            </div>
            <Progress
              value={invoiceProgress}
              className="h-2"
              style={
                {
                  "--progress-foreground": isInvoiceLimitReached
                    ? "hsl(0 84% 60%)"
                    : "hsl(262 81% 58%)",
                } as React.CSSProperties
              }
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">
                Token Usage
              </span>
              <span
                className={`font-semibold ${
                  isTokenLimitReached ? "text-red-600" : "text-muted-foreground"
                }`}
              >
                {usage.tokens.toLocaleString()}/{usageLimit.tokens}
              </span>
            </div>
            <Progress
              value={tokenProgress}
              className="h-2"
              style={
                {
                  "--progress-foreground": isTokenLimitReached
                    ? "hsl(0 84% 60%)"
                    : "hsl(262 81% 58%)",
                } as React.CSSProperties
              }
            />
          </div>
        </div>

        {/* Alert */}
        {reachedAnyLimit && (
          <div className="flex items-start gap-2 rounded-lg border border-[hsl(262_60%_75%)] bg-[hsl(262_60%_97%)] p-3 dark:border-[hsl(262_60%_35%)] dark:bg-[hsl(262_60%_15%)]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(262_81%_58%)]" />
            <div className="text-xs leading-relaxed text-[hsl(262_81%_40%)] dark:text-[hsl(262_60%_80%)]">
              <span className="font-semibold">Limit reached!</span> Upgrade to
              continue creating invoices and using AI tools without
              interruptions.
            </div>
          </div>
        )}

        {/* Upgrade CTA */}
        {nextPlan && (
          <Link href={`/pricing?plan=${nextPlan.toLowerCase()}`}>
            <Button
              size="sm"
              className="mt-2 w-full bg-[hsl(262_81%_58%)] text-white shadow-md transition-all duration-200 hover:bg-[hsl(262_81%_52%)] hover:shadow-lg"
            >
              <div className="flex items-center gap-2 text-xs font-semibold">
                <TrendingUp className="h-4 w-4" />
                <span>Upgrade to {nextPlan}</span>
              </div>
            </Button>
          </Link>
        )}

        {/* Small hint */}
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Cancel anytime • Priority support included
        </p>
      </CardContent>
    </Card>
  );
}
