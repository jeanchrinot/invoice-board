import { z } from "zod";

import { invoiceSchema } from "./invoice-schema";

export function createInvoiceTools() {
  return {
    createInvoiceDraft: {
      description: "Initialize a new invoice draft",
      parameters: z.object({}),
      execute: async () => {
        return { draft: {} };
      },
    },
    setFreelancerInfo: {
      description: "Set freelancer (from) information for the invoice",
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
        return {
          draft: {
            from: { name, address, city, state, zip, email, phone },
          },
        };
      },
    },
    setClientInfo: {
      description: "Set client (billTo) information for the invoice",
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
        return {
          draft: {
            billTo: { name, address, city, state, zip, email, phone },
          },
        };
      },
    },
    setInvoiceDetails: {
      description: "Set invoice details (number, date, dueDate, currency)",
      parameters: z.object({
        number: z.string().optional(),
        date: z.string().optional(),
        dueDate: z.string().optional(),
        currency: z.string().optional(),
      }),
      execute: async ({ number, date, dueDate, currency }) => {
        return {
          draft: { number, date, dueDate, currency },
        };
      },
    },
    addLineItem: {
      description: "Add a line item to the invoice",
      parameters: z.object({
        description: z.string(),
        quantity: z.number().min(1),
        rate: z.number().min(0),
        amount: z.number().min(0),
      }),
      execute: async ({ description, quantity, rate, amount }) => {
        return {
          draft: {
            items: [{ description, quantity, rate, amount }],
          },
        };
      },
    },
    setPaymentDetails: {
      description: "Set payment details and custom notes for the invoice",
      parameters: z.object({
        paymentDetails: z.string(),
        customNotes: z.string().optional(),
      }),
      execute: async ({ paymentDetails, customNotes }) => {
        return {
          draft: { paymentDetails, customNotes },
        };
      },
    },
    finalizeInvoice: {
      description: "Finalize the invoice with calculated totals",
      parameters: z.object({
        draft: invoiceSchema.partial(),
      }),
      execute: async ({ draft }) => {
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
        });

        return { invoice: finalizedInvoice };
      },
    },
  };
}
