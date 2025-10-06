"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useInvoiceStore } from "@/stores/invoiceStore";
import clsx from "clsx";

import { useUser } from "@/hooks/use-user";
import InvoicePreview from "@/components/chat/invoice-preview";

import { InvoiceForm } from "../forms/invoice-form";

const ManualInvoice = () => {
  const [mobileTab, setMobileTab] = useState<"chat" | "preview">("chat");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { user } = useUser();
  const router = useRouter();
  const { usageLimit } = useUser();
  const { draft, setDraft } = useInvoiceStore();
  const params = useParams();
  const invoiceId = params?.invoiceId as string | undefined;

  const fetchInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();

      console.log("invoice", data);
      if (data?.id) {
        setIsGenerating(true);
        setDraft(data);
        const timeout = setTimeout(() => {
          setIsGenerating(false);
        }, 2000);

        return () => clearTimeout(timeout);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice(invoiceId);
    }
  }, [invoiceId]);

  return (
    <div className="h-screen overflow-hidden bg-background dark:bg-gradient-to-br dark:from-slate-900 dark:via-gray-900 dark:to-black dark:text-white">
      <div className="flex h-full flex-col overflow-hidden md:flex-row">
        <div
          className={clsx(
            "h-full w-full overflow-hidden border-r border-gray-300 dark:border-gray-700/50 md:w-1/2",
            mobileTab !== "chat" && "hidden md:block",
          )}
        >
          <InvoiceForm />
        </div>

        <div
          className={clsx(
            "h-full w-full md:w-1/2",
            mobileTab !== "preview" && "hidden md:block",
          )}
        >
          <div className="h-full">
            <InvoicePreview invoice={draft} isGenerating={isGenerating} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualInvoice;
