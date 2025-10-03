import { Clock } from "lucide-react";

import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { PageContentWrapper } from "@/components/dashboard/page-content-wrapper";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export const metadata = constructMetadata({
  title: "Clients | InvoiceBoard",
  description: "Manage your clients",
});

export default async function ClientsPage() {
  return (
    <PageContentWrapper>
      <DashboardHeader heading="Clients" text={`Manage your clients`} />
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="users" />
        <EmptyPlaceholder.Title>Coming Soon</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          {`We're building powerful client management features, including client
          profiles, contact details, and invoice history, so you can manage
          everything in one place.`}
        </EmptyPlaceholder.Description>
      </EmptyPlaceholder>
    </PageContentWrapper>
  );
}
