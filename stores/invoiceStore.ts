import { create } from "zustand";

interface InvoiceDraftStore {
  invoiceId: string | null;
  draft: any | null;
  loading: boolean;
  setInvoiceId: (id: string) => void;
  fetchDraft: () => Promise<void>;

  // Optional: derived getters
  freelancer: Record<string, any>;
  client: Record<string, any>;
  invoiceMeta: Record<string, any>;
  items: any[];
  paymentTerms: Record<string, any>;
  note: string;
  currency: string;
  tax: number;
  credit: number;
}

export const useInvoiceDraftStore = create<InvoiceDraftStore>((set, get) => ({
  invoiceId: null,
  draft: null,
  loading: false,

  setInvoiceId: (id) => set({ invoiceId: id }),

  fetchDraft: async () => {
    const { invoiceId } = get();
    if (!invoiceId) return;

    set({ loading: true });

    try {
      const res = await fetch(`/api/invoice/${invoiceId}`);
      if (!res.ok) throw new Error("Failed to fetch draft");
      const data = await res.json();
      set({ draft: data });
    } catch (err) {
      console.error(err);
      set({ draft: null });
    } finally {
      set({ loading: false });
    }
  },

  // Derived fields — update automatically when `draft` updates
  get freelancer() {
    return get().draft?.freelancerInfo ?? {};
  },
  get client() {
    return get().draft?.clientInfo ?? {};
  },
  get invoiceMeta() {
    return get().draft?.invoiceDetails ?? {};
  },
  get items() {
    return get().draft?.lineItems?.items ?? [];
  },
  get paymentTerms() {
    return get().draft?.paymentTerms ?? {};
  },
  get note() {
    return get().draft?.customNote ?? "";
  },
  get currency() {
    return get().draft?.invoiceDetails?.currency ?? "USD";
  },
  get tax() {
    return get().draft?.invoiceDetails?.tax ?? 0;
  },
  get credit() {
    return get().draft?.invoiceDetails?.credit ?? 0;
  },
}));
