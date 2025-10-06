"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAssistantStore } from "@/stores/assistantStore";
import { Sparkle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const examplePrompt = `Create an invoice for my client Acme Corp. Include the following services: Website design $1500, Logo redesign $300. Client email is billing@acmecorp.com. My business info is John Doe Freelance Studio, 123 Main Street, Los Angeles, CA, 90001, john@example.com. Use USD as currency. The invoice is due in 14 days. Apply 10% tax. Payment details: Bank Transfer to ACME Bank, IBAN US00XXXX. Add a note: Thank you for your business.`;

export default function TryItNowSection() {
  const [input, setInput] = useState(examplePrompt);
  const { setTryItPrompt } = useAssistantStore();
  const router = useRouter();

  const handleTry = () => {
    if (!input.trim()) return;
    setTryItPrompt(input);
    router.push("/ai-assistant");
  };

  return (
    <section className="w-full bg-gradient-to-b from-background to-muted/40 py-20">
      <div className="container mx-auto max-w-3xl space-y-6 text-center">
        <h2 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          {/* Try It Now
          <br /> */}
          <span className="text-gradient_indigo-purple font-extrabold">
            Try It Now
          </span>
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Type what you need below and let the AI create your invoice instantly.
        </p>

        <div className="mt-8">
          <Label htmlFor="invoice-prompt" className="sr-only">
            Try creating an invoice
          </Label>
          <Textarea
            id="invoice-prompt"
            rows={6}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-48 w-full resize-none rounded-2xl border border-border bg-background p-4 text-base shadow-sm focus-visible:ring-2 focus-visible:ring-primary/60"
            placeholder={examplePrompt}
          />
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            rounded="full"
            className="gap-2"
            onClick={handleTry}
          >
            <Sparkle className="size-5" />
            Generate Invoice
          </Button>
        </div>

        {/* <p className="mt-4 text-xs text-muted-foreground">
          Example prompt: “Create an invoice for ACME Design Studio for a logo
          design project due in 10 days.”
        </p> */}
      </div>
    </section>
  );
}
