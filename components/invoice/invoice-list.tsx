"use client";

import { useEffect } from "react";
import { useInvoiceDraftStore } from "@/stores/invoiceStore";

import { calculateAmount, getStatusClass } from "@/lib/invoice";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

const InvoiceTable = () => {
  const { drafts, loading, fetchAllDrafts } = useInvoiceDraftStore();

  useEffect(() => {
    fetchAllDrafts();
  }, [fetchAllDrafts]);

  if (loading)
    return (
      <div className="container flex h-screen flex-col items-center justify-center py-10">
        <p>Loading invoice draft...</p>
      </div>
    );
  if (!drafts || drafts?.length == 0)
    return (
      <div className="container flex h-screen max-w-full flex-col items-center justify-center overflow-x-auto py-10">
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="post" />
          <EmptyPlaceholder.Title>No invoice created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any invoice yet. Start creating one by asking
            the AI Assistant.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      </div>
    );

  return (
    <div className="flex w-full flex-col py-10 lg:h-screen">
      <h2 className="mb-4 text-balance text-center font-urban text-xl font-extrabold tracking-tight sm:text-2xl md:text-2xl">
        My Invoices{" "}
      </h2>
      <p className="mb-6 text-balance text-center text-sm leading-normal text-muted-foreground">
        Manage your invoices. You can ask the AI Assistant to create new invoice
        or update an existing one.
      </p>
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg border border-gray-200 shadow-sm">
          <thead className="bg-gray-100 text-sm font-medium text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Invoice #</th>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Issue Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {drafts?.map((draft, index) => (
              <tr key={index}>
                <td className="px-4 py-3">{draft?.invoiceNumber}</td>
                <td className="px-4 py-3">{draft?.clientInfo?.clientName}</td>
                <td className="px-4 py-3">
                  {draft?.invoiceDetails?.currency} {calculateAmount(draft)}
                </td>
                <td className={`px-4 py-3 ${getStatusClass(draft?.status)}`}>
                  {draft?.status}
                </td>
                <td className="px-4 py-3">
                  {draft?.invoiceDetails?.issueDate
                    ? new Date(
                        draft?.invoiceDetails?.issueDate,
                      ).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable;
