import { number } from "prop-types";
import { z } from "zod";

import { getSelectedDraft, setSelectedDraft } from "../ai-memory";
import {
  createInvoiceNumber,
  createOrUpdateInvoice,
  findInvoice,
  generateInvoiceNumber,
} from "../invoice";
import { invoiceSchema } from "./invoice-schema";

export function createInvoiceTools(
  userId: string | null | undefined,
  draftId: string | null | undefined,
) {
  // const draftId = userId ? getSelectedDraft(userId) : null;
  return {
    selectInvoiceByNumber: {
      description:
        "Select an invoice draft based on invoice number. Use this when user wants to edit an exisiting invoice.",
      parameters: z.object({
        number: z.string(),
      }),
      execute: async ({ number }) => {
        try {
          if (!userId) {
            return {
              message: `Only authenticated users can save and edit existing invoices. Please, create an account.`,
            };
          }
          const draft = await findInvoice(userId, number);

          if (!draft) {
            return {
              message: `No invoice draft matching your query was found.`,
            };
          }

          setSelectedDraft(userId, draft.id);

          return {
            message: `Selected invoice draft for ${number}`,
            draftId: draft.id,
          };
        } catch (error) {
          console.log("error", error);
          return {
            message: "Something went wrong while processing your request.",
          };
        }
      },
    },

    createInvoiceDraft: {
      description:
        "Initialize a new invoice draft with a generated invoice number.",
      parameters: z.object({
        number: z.string(),
      }),
      execute: async () => {
        try {
          // Save Invoice
          let draft: any = { number };
          if (userId) {
            const newNumber = await createInvoiceNumber(userId);
            draft = await createOrUpdateInvoice(null, userId, {
              ...draft,
              number: newNumber,
            });
            setSelectedDraft(userId, draft.id);
          }
          return { draft };
        } catch (error) {
          console.log("error", error);
          return {
            message:
              "Something went wrong while trying to initialize your invoice.",
          };
        }
      },
    },
    setFreelancerInfo: {
      description: "Set service provider information for the invoice",
      parameters: z.object({
        name: z.string(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
      }),
      execute: async ({ name, address, city, state, zip, email, phone }) => {
        try {
          let draft: any = {
            from: { name, address, city, state, zip, email, phone },
          };

          if (userId && draftId) {
            draft = await createOrUpdateInvoice(draftId, userId, draft);
          }
          return {
            draft,
          };
        } catch (error) {
          console.log("error", error);
          return {
            message: "Something went wrong while processing your request.",
          };
        }
      },
    },
    setClientInfo: {
      description: "Set client information for the invoice",
      parameters: z.object({
        name: z.string(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
      }),
      execute: async ({ name, address, city, state, zip, email, phone }) => {
        try {
          let draft: any = {
            billTo: { name, address, city, state, zip, email, phone },
          };

          if (userId && draftId) {
            draft = await createOrUpdateInvoice(draftId, userId, draft);
          }
          return {
            draft,
          };
        } catch (error) {
          console.log("error", error);
          return {
            message: "Something went wrong while processing your request.",
          };
        }
      },
    },
    setInvoiceDetails: {
      description: "Set invoice details (date, dueDate, currency)",
      parameters: z.object({
        date: z.string(),
        dueDate: z.string(),
        currency: z.string(),
      }),
      execute: async ({ date, dueDate, currency }) => {
        try {
          let draft: any = { date, dueDate, currency };

          if (userId && draftId) {
            const dateISO = new Date(date).toISOString();
            const dueDateISO = new Date(dueDate).toISOString();
            draft = await createOrUpdateInvoice(draftId, userId, {
              ...draft,
              date: dateISO,
              dueDate: dueDateISO,
            });
          }
          return {
            draft,
          };
        } catch (error) {
          console.log("error", error);
          return {
            message: "Something went wrong while processing your request.",
          };
        }
      },
    },
    addLineItems: {
      description:
        "Update the invoice items with a final array of line items. If available provide tax rate.",
      parameters: z.object({
        taxRate: z.number().optional(),
        items: z.array(
          z.object({
            description: z.string(),
            quantity: z.number().min(1),
            rate: z.number().min(0),
            amount: z.number().min(0),
          }),
        ),
      }),
      execute: async ({ items, taxRate }) => {
        try {
          let draft: any = { items, taxRate };

          if (userId && draftId) {
            draft = await createOrUpdateInvoice(draftId, userId, draft);
          }

          return { draft };
        } catch (error) {
          console.error("error", error);
          return {
            message: "Something went wrong while processing your request.",
          };
        }
      },
    },

    // addLineItem: {
    //   description: "Add a line item to the invoice",
    //   parameters: z.object({
    //     description: z.string(),
    //     quantity: z.number().min(1),
    //     rate: z.number().min(0),
    //     amount: z.number().min(0),
    //   }),
    //   execute: async ({ description, quantity, rate, amount }) => {
    //     try {
    //       let draft: any = {
    //         items: [{ description, quantity, rate, amount }],
    //       };

    //       if (userId && draftId) {
    //         draft = await createOrUpdateInvoice(draftId, userId, draft);
    //       }
    //       return {
    //         draft,
    //       };
    //     } catch (error) {
    //       console.log("error", error);
    //       return {
    //         message: "Something went wrong while processing your request.",
    //       };
    //     }
    //   },
    // },
    setPaymentDetails: {
      description: "Set payment details and custom notes for the invoice",
      parameters: z.object({
        paymentDetails: z.string(),
        customNotes: z.string().optional(),
      }),
      execute: async ({ paymentDetails, customNotes }) => {
        try {
          let draft: any = { paymentDetails, customNotes };

          if (userId && draftId) {
            draft = await createOrUpdateInvoice(draftId, userId, draft);
          }
          return {
            draft,
          };
        } catch (error) {
          console.log("error", error);
          return {
            message: "Something went wrong while processing your request.",
          };
        }
      },
    },
    finalizeInvoice: {
      description: "Finalize the invoice with calculated totals",
      parameters: z.object({
        draft: invoiceSchema.partial(),
      }),
      execute: async ({ draft }) => {
        try {
          const items = draft.items || [];
          const subtotal = items.reduce(
            (sum, item) => sum + (item.amount || 0),
            0,
          );
          const taxRate = draft.taxRate || 0;
          const tax = Math.round(subtotal * (taxRate / 100));
          const total = subtotal + tax;

          const finalizedInvoice = invoiceSchema.parse({
            ...draft,
            items,
            subtotal,
            taxRate,
            tax,
            total,
            status: "COMPLETE",
          });

          // Save Invoice
          let invoice: any = finalizedInvoice;
          if (userId && draftId) {
            invoice = await createOrUpdateInvoice(
              draftId,
              userId,
              finalizedInvoice,
            );
          }

          return { invoice };
        } catch (error) {
          console.log("error", error);
          return {
            message:
              "Something went wrong while trying to finalize your invoice.",
          };
        }
      },
    },
  };
}
