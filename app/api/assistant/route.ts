import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

import { createInvoiceTools } from "@/lib/invoice/invoice-tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, draft } = await req.json();

  const invoiceTools = createInvoiceTools();

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages,
    system: `You are an AI assistant helping a user create invoices in a guest-first approach. Your primary task is to determine the user's intent based on their message. If the user intends to create or modify an invoice (e.g., mentions "invoice," "bill," "payment," or describes services, clients, or amounts), use the provided tools to build the invoice step-by-step or in one go if all details are provided. If the intent is unclear or unrelated to invoices, respond with a helpful message suggesting invoice creation. Workflow for invoice creation:
1) Initialize a draft if none exists.
2) Collect freelancer (from) info.
3) Collect client (billTo) info.
4) Set invoice details (number, date, dueDate, currency).
5) Add line items.
6) Set payment details and notes.
7) Finalize the invoice with calculated totals.
If the user's message contains partial information, use the appropriate tool to update the draft. If information is missing, prompt the user for details. Use defaults from the schema for optional fields. The current draft is: ${JSON.stringify(draft) || "none"}.`,
    tools: invoiceTools,
  });

  return result.toDataStreamResponse();
}
