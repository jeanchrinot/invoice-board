import { tool } from "ai";
import { z } from "zod";

import { getSelectedDraft, setSelectedDraft } from "@/lib/ai-memory";
import {
  countUserInvoiceDrafts,
  createInvoiceDraft,
  createInvoiceDraftWithPrefill,
  createInvoicePreviewLink,
  deleteInvoiceDraft,
  findInvoiceDraft,
  findInvoiceDraftById,
  getLatestCompleteInvoice,
  getUniqueClientsList,
  updateInvoiceCustomNote,
  updateInvoiceDraftSection,
  updateInvoiceDraftStatus,
  withDraftCheck,
} from "@/lib/invoice";

export function createInvoiceTools(userId: string) {
  const draftId = getSelectedDraft(userId);

  return {
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
        "Create a new invoice blank draft. Use this when user wants to create a new invoice. You must gather information about the invoice later.",
      parameters: z.object({
        prefillFromPrevious: z
          .boolean()
          .default(true)
          .describe("Whether to prefill common data from previous invoices"),
      }),
      execute: async ({ prefillFromPrevious = true }) => {
        let draft;

        if (prefillFromPrevious) {
          draft = await createInvoiceDraftWithPrefill(userId, "INVOICE");
        } else {
          draft = await createInvoiceDraft(userId, "INVOICE");
        }

        if (!draft) {
          return {
            message: `Sorry! Unable to create invoice draft.`,
          };
        }

        setSelectedDraft(userId || "", draft.id);

        const prefilledFields: string[] = [];
        if (draft.freelancerInfo) prefilledFields.push("freelancer info");
        if (draft.paymentTerms) prefilledFields.push("payment terms");
        if (draft.invoiceDetails?.currency) prefilledFields.push("currency");
        if (draft.invoiceDetails?.tax) prefilledFields.push("tax rate");

        const message =
          prefilledFields.length > 0
            ? `Created invoice draft with prefilled ${prefilledFields.join(", ")} from your previous invoices.`
            : `Created a blank invoice draft.`;

        return {
          message,
          draftId: draft.id,
          prefilledFields,
        };
      },
    }),

    getAvailableClients: tool({
      description:
        "Get list of previous clients to offer for reuse. Use this when user is adding client info to suggest previous clients.",
      parameters: z.object({}),
      execute: async () => {
        const clients = await getUniqueClientsList(userId);
        return {
          message: `Found ${clients.length} previous clients`,
          clients: clients.map((client) => ({
            name: client.clientName,
            email: client.clientEmail,
            phone: client.clientPhone,
            address: client.clientAddress,
          })),
        };
      },
    }),

    copyClientFromPrevious: tool({
      description:
        "Copy client information from a previous invoice by client name or email.",
      parameters: z.object({
        clientIdentifier: z
          .string()
          .describe("Client name or email to search for"),
      }),
      execute: async ({ clientIdentifier }) => {
        if (!draftId) {
          return "Please specify invoice ID.";
        }

        const clients = await getUniqueClientsList(userId);
        const matchingClient = clients.find(
          (client) =>
            client.clientName
              ?.toLowerCase()
              .includes(clientIdentifier.toLowerCase()) ||
            client.clientEmail
              ?.toLowerCase()
              .includes(clientIdentifier.toLowerCase()),
        );

        if (!matchingClient) {
          return {
            message: `No previous client found matching "${clientIdentifier}". Available clients: ${clients.map((c) => c.clientName).join(", ")}`,
          };
        }

        const clientData = {
          clientName: matchingClient.clientName,
          clientEmail: matchingClient.clientEmail,
          clientPhone: matchingClient.clientPhone,
          clientAddress: matchingClient.clientAddress,
        };

        await updateInvoiceDraftSection(draftId, "clientInfo", clientData);

        return {
          message: `Copied client information for ${matchingClient.clientName}`,
          clientData,
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
      description:
        "Collect due date, and optionally update currency and tax if needed. Issue date is automatically set to today.",
      parameters: z.object({
        dueDate: z.string().date(),
        currency: z.enum(["USD", "EUR", "GBP", "TRY", "INR"]).optional(),
        tax: z.number().optional(),
        issueDate: z.string().date().optional(),
      }),
      execute: async (data) => {
        if (!draftId) {
          return "Please specify invoice ID.";
        }

        // If issue date is not provided, use today's date
        if (!data.issueDate) {
          data.issueDate = new Date().toISOString().split("T")[0];
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
  };
}
