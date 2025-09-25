import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import InvoicesList from "@/components/dashboard/invoices/invoices-list";
import { PageContentWrapper } from "@/components/dashboard/page-content-wrapper";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export const metadata = constructMetadata({
  title: "My Invoices | InvoiceBoard",
  description: "Manage your invoices.",
});

export default async function DashboardInvoicesPage() {
  return (
    <PageContentWrapper>
      <DashboardHeader heading="My Invoices" text={`Manage your invoices.`} />
      <InvoicesList />
    </PageContentWrapper>
  );
}
