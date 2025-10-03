import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import BasicCards from "@/components/dashboard/basic-cards";
import { DashboardHeader } from "@/components/dashboard/header";
import InvoicesList from "@/components/dashboard/invoices-list";
import { PageContentWrapper } from "@/components/dashboard/page-content-wrapper";

export const metadata = constructMetadata({
  title: "Dashboard | InvoiceBoard",
  description: "Create and manage content.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <PageContentWrapper>
      <DashboardHeader
        heading="Dashboard"
        text={`Welcome back, ${user?.name}! Get a quick overview of your invoicing activity.`}
      />
      <BasicCards />
      <InvoicesList />
    </PageContentWrapper>
  );
}
