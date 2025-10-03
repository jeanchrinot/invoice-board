"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  FileText,
  Send,
  Wallet,
  XCircle,
} from "lucide-react";

import InfoCard from "./info-card";

type Stats = {
  inProgress: number;
  complete: number;
  cancelled: number;
  sent: number;
  overdue: number;
  paid: number;
  // amountDue: number;
  // amountPaid: number;
};

export default function BasicCards() {
  const [stats, setStats] = useState<Stats | null>(null);

  const fetchInvoiceStats = async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const data = await res.json();
        console.log("data", data);
        setStats(data);
      }
    } catch (error) {
      console.log("error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    fetchInvoiceStats();
  }, []);

  if (!stats) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <InfoCard
          title="Invoice In Progress"
          description="Invoices currently being drafted"
          value={stats.inProgress}
          icon={FileText}
        />

        <InfoCard
          title="Invoice Complete"
          description="Invoices finalized and closed"
          value={stats.complete}
          icon={CheckCircle}
          variant="success"
        />

        <InfoCard
          title="Cancelled"
          description="Invoices voided or rejected"
          value={stats.cancelled}
          icon={XCircle}
          variant="danger"
        />

        <InfoCard
          title="Sent"
          description="Invoices delivered to clients but not yet paid"
          value={stats.sent}
          icon={Send}
        />

        <InfoCard
          title="Overdue"
          description="Invoices past their due date without payment"
          value={stats.overdue}
          icon={AlertCircle}
          variant="warning"
        />

        <InfoCard
          title="Paid Invoices"
          description="Number of invoices successfully paid"
          value={stats.paid}
          icon={CheckCircle}
          variant="primary"
        />

        {/* <InfoCard
          title="Amount Due"
          description="Total outstanding balance across all invoices"
          value={`$${stats.amountDue.toLocaleString()}`}
          icon={DollarSign}
          variant="danger"
        />

        <InfoCard
          title="Amount Paid"
          description="Total amount collected from paid invoices"
          value={`$${stats.amountPaid.toLocaleString()}`}
          icon={Wallet}
          variant="success"
        /> */}
      </div>

      {/* To be added later */}
      {/* <InvoicesList /> */}
    </div>
  );
}
