// Define TypeScript interfaces
export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  number: string;
  date: string;
  dueDate: string;
  currency: string;
  paymentDetails: string;
  customNotes: string;
  billTo: {
    name?: string | undefined;
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    zip?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
  };
  from: {
    name?: string | undefined;
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    zip?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
  };
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;
}
