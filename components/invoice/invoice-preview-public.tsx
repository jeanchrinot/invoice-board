"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useInvoiceDraftStore } from "@/stores/invoiceStore";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

import { siteConfig } from "@/config/site";
import { cn, nFormatter } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

import InvoiceContent from "./invoice-content";

export default function InvoicePreviewPublic() {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const { invoiceId } = useParams();
  const draftId = Array.isArray(invoiceId) ? invoiceId[0] : invoiceId;
  const { draft, loading, setInvoiceId, fetchDraft } = useInvoiceDraftStore();

  useEffect(() => {
    if (draftId) {
      console.log("draftId", draftId);
      setInvoiceId(draftId);
      fetchDraft();
    }
  }, [draftId, setInvoiceId, fetchDraft]);

  if (loading) return <p>Loading invoice draft...</p>;
  if (!draft) return <p>Invoice draft not found</p>;

  const downloadPDF = async () => {
    const element = document.getElementById("invoice-export");
    if (!element) return;

    // Force browser to render the hidden element
    element.style.display = "block";

    await new Promise((resolve) => setTimeout(resolve, 100)); // wait for DOM to paint

    const canvas = await html2canvas(element as HTMLElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const ratio = Math.min(
      pageWidth / canvas.width,
      pageHeight / canvas.height,
    );
    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Invoice-${draft?.invoiceNumber}.pdf`);
    // element.style.display = "none"
  };

  return (
    <div>
      {/* Download Button */}
      <div
        className="mb-6 flex flex-col justify-center sm:flex-row md:space-x-4"
        style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
      >
        {/* <button
          onClick={downloadPDF}
          className="rounded bg-blue-600 px-5 py-2 font-medium text-white shadow transition hover:bg-blue-700"
        >
          Download PDF
        </button> */}
        <button
          className={cn(
            buttonVariants({ variant: "default", size: "lg", rounded: "full" }),
            "mb-3 gap-2 sm:mb-0",
          )}
          onClick={downloadPDF}
        >
          <span>Download PDF</span>
          <Icons.download className="size-4" />
        </button>
        <Link
          href={"/"}
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "lg",
              rounded: "full",
            }),
            "bg-blue-600 text-white md:px-5",
          )}
        >
          <Icons.add className="mr-2 size-4" />
          <p>Create Invoice</p>
        </Link>
      </div>
      {/* Visible Invoice */}
      <div
        ref={invoiceRef}
        className="mx-auto max-w-3xl bg-white md:min-w-[794px]"
      >
        <InvoiceContent />
      </div>

      {/* Hidden Export Version */}
      <div
        id="invoice-export"
        className="absolute left-0 top-0 hidden w-[794px] bg-white p-8"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "0",
          width: "794px", // or match your real invoice width
          backgroundColor: "white",
        }}
      >
        <InvoiceContent />
      </div>
    </div>
  );
}
