import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

import { getSelectedDraft, setSelectedDraft } from "@/lib/ai-memory";
import {
  countUserInvoiceDrafts,
  createInvoiceDraft,
  createInvoicePreviewLink,
  deleteInvoiceDraft,
  findInvoiceDraft,
  findInvoiceDraftById,
  updateInvoiceCustomNote,
  updateInvoiceDraftSection,
  updateInvoiceDraftStatus,
  withDraftCheck,
} from "@/lib/invoice";
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

  const draftId = getSelectedDraft(user.id);

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system:
      "You are helping a freelancer manage invoices. You can update invoice drafts or create new ones using tools. When creating a new invoice, start by creating the blank draft and then ask for freelancer details. Then, ask for client information. Finally, ask for the services provided. Use tools to collect these. After creating or updating an invoice, use the appropriate tool to create preview link. ",
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
      countUserInvoiceDrafts: tool({
        description: "Count user invoice with specific status or all.",
        parameters: z.object({
          status: z
            .enum([
              "IN_PROGRESS",
              "COMPLETE",
              "SENT",
              "PAID",
              "CANCELLED",
              "OVERDUE",
            ])
            .optional(),
        }),
        execute: async ({ status }) => {
          const count = await countUserInvoiceDrafts(userId || "", status);
          return { count };
        },
      }),
      createNewInvoiceDraft: tool({
        description:
          "Create a new invoice blank draft. Use this when user wants to create an new invoice. You must gather information about the invoice later.",
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
          if (!draftId) {
            return "Please specify invoice ID.";
          }
          await updateInvoiceDraftSection(draftId, "freelancerInfo", data);
          return await withDraftCheck(draftId, data);
        },
      }),

      getClientInfo: tool({
        description: "Collect client name/email/phone/address",
        parameters: z.object({
          clientName: z.string(),
          clientEmail: z.string().email(),
          clientPhone: z.string().optional(),
          clientAddress: z.string().optional(),
        }),
        execute: async (data) => {
          if (!draftId) {
            return "Please specify invoice ID.";
          }
          await updateInvoiceDraftSection(draftId, "clientInfo", data);
          return await withDraftCheck(draftId, data);
        },
      }),

      getInvoiceDetails: tool({
        description: "Collect dates, currency, and tax (percentage)",
        parameters: z.object({
          issueDate: z.string().date(),
          dueDate: z.string().date(),
          currency: z.enum(["USD", "EUR", "GBP", "TRY", "INR"]),
          tax: z.number().optional(),
        }),
        execute: async (data) => {
          if (!draftId) {
            return "Please specify invoice ID.";
          }
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
          if (!draftId) {
            return "Please specify invoice ID.";
          }
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
          if (!draftId) {
            return "Please specify invoice ID.";
          }
          await updateInvoiceDraftSection(draftId, "paymentTerms", data);
          return await withDraftCheck(draftId, data);
        },
      }),
      getCustomNote: tool({
        description: "Collect custom note to client if needed.",
        parameters: z.object({
          customNote: z.string().optional(),
        }),
        execute: async ({ customNote }) => {
          if (!draftId) {
            return "Please specify invoice ID.";
          }
          await updateInvoiceCustomNote(draftId, customNote);
          return await withDraftCheck(draftId, { customNote });
        },
      }),
      fetchInvoiceDraft: tool({
        description:
          "Fetch invoice draft data from database. Use this when you need to access current invoice data. If user wants to update partly the invoice data you need to add the rest of the info from draft data.",
        parameters: z.object({}),
        execute: async () => {
          if (!draftId) {
            return "Please specify invoice ID.";
          }
          const draft = await findInvoiceDraftById(userId, draftId);

          if (!draft) {
            return {
              message: `No invoice draft matching the query was found.`,
            };
          }

          return {
            draft: draft,
          };
        },
      }),
      createInvoicePreviewLink: tool({
        description:
          "Create a preview link for a draft invoice. Use this after creating or updating an invoice draft.",
        parameters: z.object({}),
        execute: async () => {
          if (!draftId) {
            return "Please specify invoice ID.";
          }
          const previewLink = createInvoicePreviewLink(draftId);

          return {
            previewLink: previewLink,
          };
        },
      }),
      updateInvoiceDraftStatus: tool({
        description: "Update invoice draft status. ",
        parameters: z.object({
          status: z.enum([
            "IN_PROGRESS",
            "COMPLETE",
            "SENT",
            "PAID",
            "CANCELLED",
            "OVERDUE",
          ]),
        }),
        execute: async ({ status }) => {
          if (!draftId) {
            return "Please specify invoice ID.";
          }
          await updateInvoiceDraftStatus(draftId, status);

          return await withDraftCheck(draftId, { status });
        },
      }),
      deleteInvoiceDraft: tool({
        description: "Delete an invoice draft.",
        parameters: z.object({}),
        execute: async () => {
          if (!draftId || !userId) {
            return "Please specify invoice ID.";
          }
          await deleteInvoiceDraft(userId || "", draftId);

          return { draftId };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
