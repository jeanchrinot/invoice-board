import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import InvoicePreview from "@/components/invoice/invoice-preview";

export const metadata = constructMetadata({
  title: "Invoice | SaaS Starter",
  description: "Preview your invoice.",
});

export default async function InvoicePreviewPage() {
  return (
    <>
      <DashboardHeader heading="Invoice" text={`Preview your invoice.`} />
      <div className="grid gap-8">
        <InvoicePreview />
      </div>
    </>
  );
}
