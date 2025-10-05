import ManualInvoice from "@/components/dashboard/invoices/manual-invoice";

export const metadata = {
  title: "Edit invoice manually | InvoiceBoard",
  description: "Edit your invoice manually",
};

export default async function AIAssistantPage() {
  return <ManualInvoice />;
}
