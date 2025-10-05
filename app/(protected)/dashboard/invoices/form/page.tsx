import ManualInvoice from "@/components/dashboard/invoices/manual-invoice";

export const metadata = {
  title: "Create invoice manually | InvoiceBoard",
  description: "Create your invoice manually",
};

export default async function AIAssistantPage() {
  return <ManualInvoice />;
}
