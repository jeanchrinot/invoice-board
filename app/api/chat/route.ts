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
    system:
      "You are helping a freelancer manage invoices. You can update invoice drafts or create new ones using tools. When creating a new invoice, start by creating the blank draft and then ask for freelancer details. Then, ask for client information. Finally, ask for the services provided. Use tools to collect these. After creating or updating an invoice, use the appropriate tool to create preview link. ",
    tools: invoiceTools,
  });

  return result.toDataStreamResponse();
}
