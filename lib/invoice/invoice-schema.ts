import { DraftStatus } from "@prisma/client";
import { z } from "zod";

export const invoiceSchema = z.object({
  number: z.string().default(
    `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`,
  ),
  status: z.nativeEnum(DraftStatus).default(DraftStatus.IN_PROGRESS),
  date: z.string().default(new Date().toISOString().split("T")[0]),
  dueDate: z
    .string()
    .default(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    ),
  currency: z.string().default("USD"),
  paymentDetails: z
    .string()
    .default("Bank Transfer: Please contact us for payment details"),
  customNotes: z
    .string()
    .default(
      "Thank you for your business! Please remit payment within 30 days.",
    ),
  billTo: z.object({
    name: z.string().default("Unknown Client"),
    address: z.string().default(""),
    city: z.string().default(""),
    state: z.string().default(""),
    zip: z.string().default(""),
    email: z.string().email().default(""),
    phone: z.string().default(""),
  }),
  from: z.object({
    name: z.string().default("Your Company"),
    address: z.string().default(""),
    city: z.string().default(""),
    state: z.string().default(""),
    zip: z.string().default(""),
    email: z.string().email().default(""),
    phone: z.string().default(""),
  }),
  items: z
    .array(
      z.object({
        description: z.string(),
        quantity: z.number().min(1),
        rate: z.number().min(0),
        amount: z.number().min(0),
      }),
    )
    .min(1),
  subtotal: z.number().min(0),
  taxRate: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  total: z.number().min(0),
});

export interface Invoice {
  number: string;
  status: string;
  date: string;
  dueDate: string;
  currency: string;
  paymentDetails: string;
  customNotes: string;
  billTo: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    email: string;
    phone: string;
  };
  from: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    email: string;
    phone: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;
}
export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}
