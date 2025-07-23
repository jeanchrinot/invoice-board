import Link from "next/link";
import { useAssistantStore } from "@/stores/assistantStore";
import { AlertTriangle, Crown, Zap } from "lucide-react";

import { guestUserLimit } from "@/config/user";
import { getRemainingTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function SignUpCard() {
  const { isInvoiceLimitReached, isTokenLimitReached, usage } =
    useAssistantStore();

  const invoiceProgress = Math.min(
    (usage.invoicesCreated / guestUserLimit.invoices) * 100,
    100,
  );
  const tokenProgress = Math.min(
    (usage.tokensUsed / guestUserLimit.tokens) * 100,
    100,
  );

  return (
    <Card className="md:max-xl:rounded-none md:max-xl:border-none md:max-xl:shadow-none">
      <CardHeader className="pb-3 md:max-xl:px-4">
        <div className="flex items-center gap-2">
          <Crown className="size-4 text-blue-600" />
          <CardTitle className="text-md">Create Your Account</CardTitle>
        </div>
        <CardDescription className="text-sm leading-relaxed">
          Save your invoices permanently and get unlimited access with enhanced
          features.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 md:max-xl:px-4">
        {/* Usage Progress */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">
                Daily Invoices
              </span>
              <span
                className={`font-semibold ${isInvoiceLimitReached() ? "text-red-600" : "text-muted-foreground"}`}
              >
                {usage.invoicesCreated}/{guestUserLimit.invoices}
              </span>
            </div>
            <Progress
              value={invoiceProgress}
              className="h-2"
              style={
                {
                  "--progress-foreground": isInvoiceLimitReached()
                    ? "hsl(0 84% 60%)"
                    : "hsl(221 83% 53%)",
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
                className={`font-semibold ${isTokenLimitReached() ? "text-red-600" : "text-muted-foreground"}`}
              >
                {usage.tokensUsed.toLocaleString()}/{guestUserLimit.tokens}
              </span>
            </div>
            <Progress
              value={tokenProgress}
              className="h-2"
              style={
                {
                  "--progress-foreground": isTokenLimitReached()
                    ? "hsl(0 84% 60%)"
                    : "hsl(221 83% 53%)",
                } as React.CSSProperties
              }
            />
          </div>
        </div>

        {/* Limit Alert */}
        {isTokenLimitReached() && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800/50 dark:bg-red-950/30">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <div className="text-xs leading-relaxed text-red-700 dark:text-red-300">
              <span className="font-semibold">Token limit reached.</span> Sign
              up for unlimited invoices and 500K monthly tokens.
            </div>
          </div>
        )}

        {/* Enhanced CTA Button */}
        <Link href="/register?redirect=/ai-assistant">
          <Button
            size="sm"
            className={`mt-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-md transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg`}
            disabled={false} // Always allow signup attempt
          >
            <div className="flex items-center gap-2 text-xs">
              <Zap className="h-4 w-4" />
              <span className="font-semibold">
                {isTokenLimitReached() ? "Sign Up Now" : "Create Free Account"}
              </span>
            </div>
          </Button>
        </Link>

        {/* Benefits hint */}
        {!isTokenLimitReached() && (
          <div className="space-y-1">
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              Free • No credit card required
            </p>
            <p className="text-center text-xs font-medium text-amber-600 dark:text-amber-500">
              ⚠️ Guest invoices are deleted in{" "}
              {getRemainingTime(usage.lastReset)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
