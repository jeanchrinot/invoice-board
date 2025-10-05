import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Invoice, InvoiceItem } from "@/lib/invoice/invoice-schema";

interface InvoiceStore {
  draft: Invoice;
  // invoice: Invoice;
  setDraft: (invoice: Partial<Invoice>) => void;
  setStatus: (status: string) => void;
  setCurrency: (status: string) => void;
  updateField: <K extends keyof Invoice>(field: K, value: Invoice[K]) => void;
  addItem: (item: InvoiceItem) => void;
  updateItem: (index: number, item: Partial<InvoiceItem>) => void;
  removeItem: (index: number) => void;
  calculateTotals: () => void;
  resetDraft: () => void;
}

export const initialDraft: Invoice = {
  number: "",
  status: "IN_PROGRESS",
  date: new Date().toISOString().split("T")[0],
  dueDate: "",
  currency: "USD",
  paymentDetails: "",
  customNotes: "",
  billTo: {
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    phone: "",
  },
  from: {
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    phone: "",
  },
  items: [],
  subtotal: 0,
  taxRate: 0,
  tax: 0,
  total: 0,
};

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      draft: initialDraft,
      // invoice: initialDraft,
      setDraft: (invoice) =>
        set((state) => ({
          draft: { ...state.draft, ...invoice },
        })),
      setStatus: (status: string) =>
        set((state) => ({ draft: { ...state.draft, status } })),
      setCurrency: (currency: string) =>
        set((state) => ({ draft: { ...state.draft, currency } })),
      updateField: (field, value) =>
        set((state) => ({
          draft: { ...state.draft, [field]: value },
        })),

      addItem: (item) =>
        set((state) => {
          const items = [...state.draft.items, item];
          return { draft: { ...state.draft, items } };
        }),

      updateItem: (index, item) =>
        set((state) => {
          const items = [...state.draft.items];
          items[index] = { ...items[index], ...item };
          return { draft: { ...state.draft, items } };
        }),

      removeItem: (index) =>
        set((state) => {
          const items = state.draft.items.filter((_, i) => i !== index);
          return { draft: { ...state.draft, items } };
        }),

      calculateTotals: () =>
        set((state) => {
          const subtotal = state.draft.items.reduce(
            (sum, item) => sum + item.quantity * item.rate,
            0,
          );
          const tax = (subtotal * (state.draft.taxRate || 0)) / 100;
          const total = subtotal + tax;
          return {
            draft: { ...state.draft, subtotal, tax, total },
          };
        }),

      resetDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "invoice-store", // localStorage key
    },
  ),
);
