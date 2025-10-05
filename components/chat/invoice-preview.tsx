import React, { useRef, useState } from "react";
import Link from "next/link";
import { useAssistantStore } from "@/stores/assistantStore";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import {
  Copy,
  Download,
  Edit3,
  ExternalLink,
  Receipt,
  Share2,
  Sparkles,
  Stars,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { Invoice } from "@/types/invoice";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InvoicePreviewProps {
  invoice: Partial<Invoice> | Invoice | null;
  isGenerating: boolean;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  isGenerating,
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  const [openAuthDialog, setOpenAuthDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);

  const downloadPDF = async () => {
    const element = document.getElementById("invoice-export");
    if (!element) return;

    // Force browser to render the hidden element
    element.style.display = "block";

    await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for DOM to paint

    const canvas = await html2canvas(element as HTMLElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Scale image to exactly match A4 dimensions
    const imgWidth = pageWidth;
    const imgHeight = pageHeight;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Invoice-${invoice?.number}.pdf`);
    element.style.display = "none";
  };

  const handleShare = () => {
    if (!user?.id) {
      setOpenAuthDialog(true);
    } else {
      setOpenShareDialog(true);
    }
  };

  const handleDownload = () => {
    if (!user?.id) {
      setOpenAuthDialog(true);
    } else {
      downloadPDF();
    }
  };

  const handleCopyLink = async () => {
    if (invoice?.status === "IN_PROGRESS" || !user?.id || !invoice?.id) {
      toast.error("Unable to copy link.");
    } else {
      const link = `${window.location.origin}/invoice/${invoice?.id}`;
      try {
        await navigator.clipboard.writeText(link);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy link:", error);
        toast.error("Failed to copy link.");
      }
    }
    setOpenShareDialog(false);
  };

  const handleOpenLink = () => {
    if (invoice?.status === "IN_PROGRESS" || !user?.id || !invoice?.id) {
      toast.error("Unable to open link.");
    } else {
      const link = `${window.location.origin}/invoice/${invoice?.id}`;
      window.open(link, "_blank");
    }

    setOpenShareDialog(false);
  };

  const formatDate = (dateString: string | undefined) => {
    const date = dateString ? new Date(dateString) : null;
    const formattedDate = date
      ? date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long", // "short" for abbreviated month
          day: "numeric",
        })
      : "";
    return formattedDate;
  };

  if (isGenerating) {
    return (
      <div className="h-full w-full px-4 py-6">
        <div className="flex h-full items-center justify-center rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-100/20 via-blue-100/20 to-indigo-100/20 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="mx-auto flex h-24 w-24 animate-pulse items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
                <Wand2 className="h-12 w-12 animate-spin text-white" />
              </div>
              <div className="absolute -right-2 -top-2 flex h-6 w-6 animate-bounce items-center justify-center rounded-full bg-yellow-400">
                <Sparkles className="h-4 w-4 text-yellow-900" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
              AI Magic in Progress...
            </h3>
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              Crafting your perfect invoice
            </p>
            <div className="flex justify-center space-x-1">
              <div className="h-2 w-2 animate-bounce rounded-full bg-purple-500"></div>
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice || !invoice?.status || invoice?.status === "IN_PROGRESS") {
    return (
      <div className="h-full w-full px-4 py-6">
        <div className="flex h-full items-center justify-center rounded-2xl border border-gray-300 bg-gradient-to-br from-gray-100/50 via-slate-100/50 to-gray-200/50 px-6 dark:border-gray-700/50 dark:from-gray-900/50 dark:via-slate-900/50 dark:to-gray-800/50">
          <div className="max-w-md text-center">
            <div className="relative mb-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <Receipt className="h-10 w-10 text-white" />
              </div>
              {/* <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <Stars className="h-4 w-4 text-white" />
              </div> */}
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
              Invoice Preview
            </h3>
            <p className="mb-6 text-gray-500 dark:text-gray-400">
              Your AI-generated invoices will appear here like magic. Start by
              asking me to create an invoice!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const InvoiceContent = () => (
    <div className="h-full w-full bg-white dark:bg-gray-900">
      {/* Invoice Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">INVOICE</h2>
            <p className="text-blue-100">#{invoice.number}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100">Date: {formatDate(invoice.date)}</p>
            <p className="text-blue-100">Due: {formatDate(invoice.dueDate)}</p>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="space-y-6 p-6">
        {/* Bill To and From Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Bill To:
            </h3>
            <div className="text-gray-600 dark:text-gray-400">
              <p className="font-medium">{invoice.billTo?.name}</p>
              <p>{invoice.billTo?.address}</p>
              <p>
                {invoice.billTo?.city ? `${invoice.billTo?.city},` : ""}{" "}
                {invoice.billTo?.state} {invoice.billTo?.zip}
              </p>
              <p>{invoice.billTo?.email}</p>
              <p>{invoice.billTo?.phone}</p>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
              From:
            </h3>
            <div className="text-gray-600 dark:text-gray-400">
              <p className="font-medium">{invoice.from?.name}</p>
              <p>{invoice.from?.address}</p>
              <p>
                {invoice.from?.city ? `${invoice.from?.city},` : ""}{" "}
                {invoice.from?.state} {invoice.from?.zip}
              </p>
              <p>{invoice.from?.email}</p>
              <p>{invoice.from?.phone}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
            Items:
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="p-3 text-left font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </th>
                  <th className="p-3 text-right font-medium text-gray-700 dark:text-gray-300">
                    Qty
                  </th>
                  <th className="p-3 text-right font-medium text-gray-700 dark:text-gray-300">
                    Rate
                  </th>
                  <th className="p-3 text-right font-medium text-gray-700 dark:text-gray-300">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="p-3 text-gray-800 dark:text-gray-200">
                      {item.description}
                    </td>
                    <td className="p-3 text-right text-gray-800 dark:text-gray-200">
                      {item.quantity}
                    </td>
                    <td className="p-3 text-right text-gray-800 dark:text-gray-200">
                      {invoice.currency} {item.rate}
                    </td>
                    <td className="p-3 text-right text-gray-800 dark:text-gray-200">
                      {invoice.currency} {item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Subtotal:
              </span>
              <span className="text-gray-800 dark:text-gray-200">
                {invoice.currency} {invoice.subtotal}
              </span>
            </div>
            {invoice.taxRate != null && invoice.taxRate > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Tax ({invoice.taxRate}%):
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {invoice.currency} {invoice.tax}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-semibold dark:border-gray-700">
              <span className="text-gray-800 dark:text-gray-200">Total:</span>
              <span className="text-gray-800 dark:text-gray-200">
                {invoice.currency} {invoice.total}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        {invoice.paymentDetails && (
          <div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Payment Information:
            </h3>
            <div className="text-gray-600 dark:text-gray-400">
              <p className="whitespace-pre-wrap">{invoice.paymentDetails}</p>
            </div>
          </div>
        )}
        {invoice.customNotes && (
          <div>
            <div className="text-gray-600 dark:text-gray-400">
              {invoice.customNotes && (
                <p className="mt-2 italic">{invoice.customNotes}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Visible Invoice */}
      <div
        ref={invoiceRef}
        className="mx-auto h-[100vh] max-w-7xl overflow-y-auto bg-white pb-4 dark:bg-gray-900"
      >
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 bg-gray-50 p-2 dark:bg-gray-800/50">
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
        <InvoiceContent />
      </div>

      {/* Hidden Export Version */}
      <div
        id="invoice-export"
        className="absolute left-[-9999px] top-0 hidden min-h-[1123px] w-[794px] bg-white dark:bg-gray-900"
      >
        <InvoiceContent />
      </div>

      {/* Auth Required Dialog */}
      <Dialog open={openAuthDialog} onOpenChange={setOpenAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign up to download and share</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Please create an account or log in to access this feature.
          </p>
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setOpenAuthDialog(false)}
            >
              Cancel
            </Button>
            <Link href="/register">
              <Button>Sign up</Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Options Dialog */}
      <Dialog open={openShareDialog} onOpenChange={setOpenShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Invoice</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-2">
            <Button variant="outline" onClick={handleCopyLink}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" onClick={handleOpenLink}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoicePreview;
