import { auth } from "@/auth";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

import { createInvoiceTools } from "@/lib/invoice/invoice-tools";
import { getCurrentUser } from "@/lib/session";

export const maxDuration = 30;

export const POST = auth(async (req) => {
  const { messages, draft } = await req.json();
  const user = await getCurrentUser();

  const invoiceTools = createInvoiceTools(user?.id, draft?.id);

  console.log("messages", messages);
  console.log("draft", draft);

  const result = await streamText({
    model: openai("gpt-4o"),
    messages,
    system: `You are an AI assistant helping a user create invoices in a guest-first approach.

    Your task is to determine if the user wants to create or modify an invoice. If they do, follow these steps and use the tools provided:
    
    1. If there's no current draft, call initializeInvoiceDraft.
    2. Ask for or fill in service provider details (business).
    3. Ask for or fill in client information.
    4. Set invoice metadata (Use defaults for: invoice number, date and dueDate. Ask for currency or parse it from user message).
    5. Add line items (services or products).
    6. Ask about payment details or notes.
    
    **Once the invoice has:**
    - At least one line item,
    - A client name,
    - And totals can be calculated,
    
    **You must call finalizeInvoice. Always call it when the invoice is complete.**
    
    After finalizing, always return a short confirmation message to the user, such as: "Invoice finalized for [client] with total [amount]. Need anything else?"
    
    Never stop without a final user-facing message.
    
    Current draft: ${JSON.stringify(draft) || "none"}.
    `,
    tools: invoiceTools,
  });

  return result.toDataStreamResponse();
});
