"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  DollarSign,
  Edit,
  ExternalLink,
  FileText,
  MoreHorizontal,
  Share2,
} from "lucide-react";

interface Invoice {
  id: string;
  userId: string;
  type: "INVOICE" | "ESTIMATE" | "QUOTE";
  status: "IN_PROGRESS" | "COMPLETE" | "DRAFT";
  number: string;
  date: string;
  dueDate: string;
  currency: string;
  paymentDetails: string;
  customNotes: string;
  billTo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  } | null;
  from: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  } | null;
  items: Array<{
    rate: number;
    amount: number;
    quantity: number;
    description: string;
  }>;
  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

const InvoicesList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices");
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (invoiceId: string) => {
    window.location.href = `/ai-assistant/${invoiceId}`;
  };

  const handleCopyLink = async (invoiceId: string) => {
    const link = `${window.location.origin}/invoice/${invoiceId}`;
    try {
      await navigator.clipboard.writeText(link);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
    setOpenDropdown(null);
  };

  const handleOpenLink = (invoiceId: string) => {
    const link = `${window.location.origin}/invoice/${invoiceId}`;
    window.open(link, "_blank");
    setOpenDropdown(null);
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
      currency: currency,
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
    <div className="overflow-hidden rounded-lg border bg-white px-0 py-4 shadow-sm dark:bg-black/20">
      <div className="border-b border-gray-200 px-6 py-3 dark:border-gray-700">
        <h2 className="text-xl font-semibold">Invoices</h2>
        <p className="mt-1 text-sm text-gray-500">
          {invoices.length} total invoices
        </p>
      </div>

      {invoices.length === 0 ? (
        <div className="py-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-700" />
          <h3 className="mt-4 text-sm font-medium">No invoices found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first invoice.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-400">
            <thead className="">
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
                  className="hover:bg-background hover:dark:bg-black/20"
                >
                  <td className="whitespace-nowrap px-2 py-3">
                    <div className="flex items-center">
                      <div className="shrink-0">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
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
                  <td className="whitespace-nowrap px-2 py-3">
                    <div className="text-sm">
                      {invoice.billTo?.name || "No client"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {invoice.billTo?.email || ""}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-2 py-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                      {invoice.date ? formatDate(invoice.date) : "-"}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-2 py-3">
                    <div className="flex items-center text-sm font-medium">
                      <DollarSign className="mr-1 h-4 w-4 text-gray-400" />
                      {formatCurrency(invoice.total, invoice.currency)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-2 py-3">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="whitespace-nowrap px-2 py-3 text-left text-sm font-medium">
                    <div className="flex items-center justify-start space-x-2">
                      <button
                        onClick={() => handleEdit(invoice.id)}
                        className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Edit with AI
                      </button>

                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === invoice.id ? null : invoice.id,
                            )
                          }
                          className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                        >
                          <Share2 className="mr-1 h-3 w-3" />
                          Share
                          <MoreHorizontal className="ml-1 h-3 w-3" />
                        </button>

                        {openDropdown === invoice.id && (
                          <div className="absolute right-0 z-10 mt-1 w-40 rounded-md border border-gray-200 bg-white shadow-lg">
                            <div className="py-1">
                              <button
                                onClick={() => handleCopyLink(invoice.id)}
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Link
                              </button>
                              <button
                                onClick={() => handleOpenLink(invoice.id)}
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open Link
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
};

export default InvoicesList;
