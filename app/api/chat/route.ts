import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

import { getSelectedDraft, setSelectedDraft } from "@/lib/ai-memory";
import {
  createInvoiceDraft,
  findInvoiceDraft,
  getActiveDraftForUser,
  updateInvoiceDraftSection,
  withDraftCheck,
} from "@/lib/invoice";
import { getCurrentUser } from "@/lib/session";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const user = await getCurrentUser();

  if (!user?.id) {
    return new Response("Authentication required.", { status: 401 });
  }

  const userId = user.id;

  const draftId = getSelectedDraft(user.id);

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system:
      "You are helping a freelancer manage invoices. You can update invoice drafts or create new ones using tools. When creating a new invoice, start by asking for freelancer details. Then, ask for client information. Finally, ask for the services provided. Use tools to collect these.",
    tools: {
      selectInvoiceDraftByInvoiceNumber: tool({
        description:
          "Select an invoice draft based on invoice number. Use this when user wants to edit an exisiting invoice.",
        parameters: z.object({
          invoiceNumber: z.string(),
        }),
        execute: async ({ invoiceNumber }) => {
          const draft = await findInvoiceDraft(userId, invoiceNumber);

          if (!draft) {
            return {
              message: `No invoice draft matching your query was found.`,
            };
          }

          setSelectedDraft(userId || "", draft.id);

          return {
            message: `Selected invoice draft for ${invoiceNumber}`,
            draftId: draft.id,
          };
        },
      }),
      createNewInvoiceDraft: tool({
        description:
          "Create a new invoice draft. Use this when user wants to create an new invoice.",
        parameters: z.object({}),
        execute: async () => {
          const draft = await createInvoiceDraft(userId, "INVOICE");

          if (!draft) {
            return {
              message: `Sorry! Unable to create invoice draft.`,
            };
          }

          setSelectedDraft(userId || "", draft.id);

          return {
            message: `Created the invoice draft.`,
            draftId: draft.id,
          };
        },
      }),
      getFreelancerInfo: tool({
        description: "Collect freelancer info",
        parameters: z.object({
          name: z.string(),
          businessName: z.string().optional(),
          email: z.string().email(),
          phone: z.string().optional(),
          address: z.string().optional(),
        }),
        execute: async (data) => {
          await updateInvoiceDraftSection(draftId, "freelancerInfo", data);
          return await withDraftCheck(draftId, data);
        },
      }),

      getClientInfo: tool({
        description: "Collect client name/email",
        parameters: z.object({
          clientName: z.string(),
          clientEmail: z.string().email(),
          clientPhone: z.string().optional(),
          clientAddress: z.string().optional(),
        }),
        execute: async (data) => {
          await updateInvoiceDraftSection(draftId, "clientInfo", data);
          return await withDraftCheck(draftId, data);
        },
      }),

      getInvoiceDetails: tool({
        description: "Collect invoice number, dates, currency",
        parameters: z.object({
          issueDate: z.string().date(),
          dueDate: z.string().date(),
          currency: z.enum(["USD", "EUR", "GBP", "TRY", "INR"]),
        }),
        execute: async (data) => {
          await updateInvoiceDraftSection(draftId, "invoiceDetails", data);
          return await withDraftCheck(draftId, data);
        },
      }),

      getLineItems: tool({
        description: "Collect invoice line items",
        parameters: z.object({
          items: z.array(
            z.object({
              description: z.string(),
              quantity: z.number(),
              rate: z.number(),
            }),
          ),
        }),
        execute: async (data) => {
          await updateInvoiceDraftSection(draftId, "lineItems", data);
          return await withDraftCheck(draftId, data);
        },
      }),

      getPaymentTerms: tool({
        description: "Collect payment method and deposit",
        parameters: z.object({
          paymentMethod: z.string(),
          depositRequired: z.boolean(),
          depositAmount: z.number().optional(),
        }),
        execute: async (data) => {
          await updateInvoiceDraftSection(draftId, "paymentTerms", data);
          return await withDraftCheck(draftId, data);
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
