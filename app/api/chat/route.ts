import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

import { createInvoiceTools } from "@/lib/llm/invoice-tools";
import { getCurrentUser, getTestingUser } from "@/lib/session";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  let user: any = await getCurrentUser();

  if (!user?.id) {
    // Get default user for testing
    user = await getTestingUser();
    if (!user) {
      return new Response("Authentication required.", { status: 401 });
    }
  }

  const userId = user.id;
  const invoiceTools = createInvoiceTools(userId);

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `You are helping a freelancer manage invoices. You can update invoice drafts or create new ones using tools. 
       When creating a new invoice, if there are previously created invoices, 
       the system will automatically prefill common information 
       (freelancer details, payment terms, currency, tax rate) from previous invoices to save time, 
       otherwise you must collect them with tools. 
       For client information, you can offer to reuse details from previous clients 
       by using the getAvailableClients tool and copyClientFromPrevious tool. 
       Always ask the user if they'd like to use a previous client or add a new one. 
       After creating or updating an invoice, use the appropriate tool to create preview link. 
       The workflow: 1) Create new draft. 2) Get freelancer info. 3) Get client info. 4) Get invoice details. 5) Get line items. 6) Get payment terms.`,
    tools: invoiceTools,
  });

  return result.toDataStreamResponse();
}
