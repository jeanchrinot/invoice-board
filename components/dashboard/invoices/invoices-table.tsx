"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  DollarSign,
  Edit,
  ExternalLink,
  FileText,
  LayoutList,
  MoreHorizontal,
  Plus,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Invoice {
  id: string;
  userId: string;
  type: "INVOICE" | "ESTIMATE" | "QUOTE";
  status: "IN_PROGRESS" | "COMPLETE" | "DRAFT";
  number: string;
  date: string;
  dueDate: string;
  currency: string;
  total: number;
  billTo: {
    name: string;
    email: string;
  } | null;
}

interface InvoicesTableProps {
  invoices: Invoice[];
  loading: boolean;
  showViewAll: boolean;
}

export const InvoicesTable: React.FC<InvoicesTableProps> = ({
  invoices,
  loading,
  showViewAll,
}) => {
  const [shareInvoiceId, setShareInvoiceId] = useState<string | null>(null);
  const [createInvoiceDialog, setCreateInvoiceDialog] =
    useState<boolean>(false);

  const onEdit = (invoiceId: string) => {
    window.location.href = `/ai-assistant/${invoiceId}`;
  };

  const onCopyLink = async (id: string) => {
    const link = `${window.location.origin}/invoice/${id}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link.");
    }
  };

  const onOpenLink = (id: string) => {
    const link = `${window.location.origin}/invoice/${id}`;
    window.open(link, "_blank");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    if (!currency) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      IN_PROGRESS: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        label: "In Progress",
      },
      COMPLETE: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        label: "Complete",
      },
      DRAFT: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: FileText,
        label: "Draft",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.color}`}
      >
        <IconComponent className="mr-1 h-3 w-3" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-black/20">
      <div className="border-b border-gray-200 px-6 py-3 dark:border-gray-700">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Invoices</h2>
            <p className="mt-1 text-sm text-gray-500">
              {showViewAll
                ? `Last ${invoices.length} invoices`
                : `${invoices.length} total invoices`}
            </p>
          </div>
          {showViewAll ? (
            <button className="ml-auto inline-flex h-9 shrink-0 select-none items-center justify-center gap-1 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground ring-offset-background transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">
              <Link
                className="flex items-center gap-2"
                href="/dashboard/invoices"
              >
                <span>View All</span>
                <ArrowUpRight className="size-4" />
              </Link>
            </button>
          ) : (
            <button
              onClick={() => setCreateInvoiceDialog(true)}
              className="ml-auto inline-flex h-9 shrink-0 select-none items-center justify-center gap-1 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground ring-offset-background transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="size-4" />
              <span>Create New Invoice</span>
            </button>
          )}
        </div>
        {/* <h2 className="text-xl font-semibold">Invoices</h2>
        <p className="mt-1 text-sm text-gray-500">
          {invoices.length} total invoices
        </p> */}
      </div>

      {invoices.length === 0 ? (
        <div className="py-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-700" />
          <h3 className="mt-4 text-sm font-medium">No invoices found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first invoice.
          </p>
          <Link href={"/ai-assistant"}>
            <Button className="mt-3">Create Invoice with AI</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-400">
            <thead>
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Client
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-400">
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50 dark:hover:bg-black/20"
                >
                  <td className="px-2 py-3">
                    <div className="flex items-center">
                      {/* <FileText className="h-5 w-5 text-gray-400" /> */}
                      <div className="ml-3">
                        <div className="text-sm font-medium">
                          {invoice.number}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoice.type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <div className="text-sm">
                      {invoice.billTo?.name || "No client"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {invoice.billTo?.email || ""}
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center text-sm">
                      {/* <Calendar className="mr-1 h-4 w-4 text-gray-400" /> */}
                      {invoice.date ? formatDate(invoice.date) : "-"}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm font-medium">
                    {/* <DollarSign className="mr-1 h-4 w-4 text-gray-400" /> */}
                    {formatCurrency(invoice.total, invoice.currency)}
                  </td>
                  <td className="px-2 py-3">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="px-2 py-3 text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(invoice.id)}
                      >
                        <Bot className="mr-1 size-4" /> Edit with AI
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShareInvoiceId(invoice.id)}
                      >
                        <Share2 className="mr-1 h-3 w-3" /> Share
                        <MoreHorizontal className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Share Dialog */}
      <Dialog
        open={!!shareInvoiceId}
        onOpenChange={() => setShareInvoiceId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Invoice</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              onClick={() => {
                if (shareInvoiceId) onCopyLink(shareInvoiceId);
                setShareInvoiceId(null);
              }}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy Link
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (shareInvoiceId) onOpenLink(shareInvoiceId);
                setShareInvoiceId(null);
              }}
            >
              <ExternalLink className="mr-2 h-4 w-4" /> Open Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog */}
      <Dialog
        open={!!createInvoiceDialog}
        onOpenChange={() => setCreateInvoiceDialog(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            <Button variant="default">
              <Link className="flex items-center gap-2" href="/ai-assistant">
                <Bot className="mr-2 h-4 w-4" /> Create With AI
              </Link>
            </Button>

            <Button variant="outline">
              <Link
                className="flex items-center gap-2"
                href="/dashboard/invoices/form"
              >
                <LayoutList className="mr-2 h-4 w-4" /> Create Manually
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
