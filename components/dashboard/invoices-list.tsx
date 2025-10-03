"use client";

import React, { useEffect, useState } from "react";

import { InvoicesTable } from "./invoices/invoices-table";

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

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices?limit=5");
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <InvoicesTable invoices={invoices} loading={loading} showViewAll={true} />
  );
};

export default InvoicesList;
