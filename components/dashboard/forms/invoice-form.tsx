"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useInvoiceStore } from "@/stores/invoiceStore";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CurrencySelect } from "./currency-select";
import { StatusSelect } from "./status-select";

export function InvoiceForm() {
  const { draft, setDraft, resetDraft, calculateTotals } = useInvoiceStore();
  const router = useRouter();
  const params = useParams();
  const invoiceId = params?.invoiceId as string | undefined;
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleChange = (field: string, value: any) => {
    setDraft({ [field]: value });
  };

  const handleBillToChange = (field: string, value: string) => {
    setDraft({ billTo: { ...draft.billTo, [field]: value } });
  };

  const handleFromChange = (field: string, value: string) => {
    setDraft({ from: { ...draft.from, [field]: value } });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...draft.items];
    newItems[index] = { ...newItems[index], [field]: value };

    // recalc amount if qty or rate changes
    if (field === "quantity" || field === "rate") {
      newItems[index].amount =
        (Number(newItems[index].quantity) || 0) *
        (Number(newItems[index].rate) || 0);
    }

    setDraft({ items: newItems });
  };

  const addItem = () => {
    setDraft({
      items: [
        ...draft.items,
        { description: "", quantity: 1, rate: 0, amount: 0 },
      ],
    });
  };

  const removeItem = (index: number) => {
    const newItems = draft.items.filter((_, i) => i !== index);
    setDraft({ items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSaving(true);
    e.preventDefault();
    calculateTotals();
    console.log("Invoice Draft:", draft);
    //Save draft to database
    try {
      const res = await fetch(`/api/invoices`, {
        method: "POST",
        body: JSON.stringify({ draft: draft }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log("data", data);
        if (data?.id) {
          if (data.id === invoiceId) {
            setDraft(data);
          } else {
            router.push(`/dashboard/invoices/form/${data.id}`);
          }
          toast.success("Invoice saved successfully!");
        } else {
          toast.error("Something went wrong while redirecting.");
        }
      } else {
        toast.error("Unable to save invoice.");
      }
    } catch (error) {
      console.log("error saving invoice:", error);
      toast.error("Unable to save invoice.");
    }
    setIsSaving(false);
  };
  useEffect(() => {
    if (draft.id && !invoiceId) {
      resetDraft();
    }
  }, [draft, invoiceId]);

  console.log("draft", draft);

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex h-full w-full flex-col space-y-4 overflow-y-auto rounded-lg bg-white p-6 shadow dark:bg-gray-900"
    >
      {/* Header */}
      <div className="">
        <h2 className="text-2xl font-bold">Invoice</h2>
        <p className="text-sm text-muted-foreground">
          #{draft.number || "Draft"}
        </p>
      </div>
      {/* Number and Status */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {invoiceId && (
          <div>
            <Label>Number</Label>
            <Input
              type="text"
              value={draft.number}
              onChange={(e) => handleChange("number", e.target.value)}
            />
          </div>
        )}
        <div>
          <StatusSelect />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Date</Label>
          <Input
            type="date"
            value={
              draft.date ? new Date(draft.date).toISOString().split("T")[0] : ""
            }
            onChange={(e) => handleChange("date", e.target.value)}
          />
        </div>
        <div>
          <Label>Due Date</Label>
          <Input
            type="date"
            value={
              draft.dueDate
                ? new Date(draft.dueDate).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => handleChange("dueDate", e.target.value)}
          />
        </div>
      </div>

      {/* Bill To / From */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-2 font-semibold">Bill To</h3>
          <div className="space-y-3">
            <Input
              placeholder="Name"
              value={draft.billTo.name}
              onChange={(e) => handleBillToChange("name", e.target.value)}
            />
            <Input
              placeholder="Address"
              value={draft.billTo.address}
              onChange={(e) => handleBillToChange("address", e.target.value)}
            />
            <Input
              placeholder="City"
              value={draft.billTo.city}
              onChange={(e) => handleBillToChange("city", e.target.value)}
            />
            <Input
              placeholder="Email"
              value={draft.billTo.email}
              onChange={(e) => handleBillToChange("email", e.target.value)}
            />
            <Input
              placeholder="Phone"
              value={draft.billTo.phone}
              onChange={(e) => handleBillToChange("phone", e.target.value)}
            />
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">From</h3>
          <div className="space-y-3">
            <Input
              placeholder="Name"
              value={draft.from.name}
              onChange={(e) => handleFromChange("name", e.target.value)}
            />
            <Input
              placeholder="Address"
              value={draft.from.address}
              onChange={(e) => handleFromChange("address", e.target.value)}
            />
            <Input
              placeholder="City"
              value={draft.from.city}
              onChange={(e) => handleFromChange("city", e.target.value)}
            />
            <Input
              placeholder="Email"
              value={draft.from.email}
              onChange={(e) => handleFromChange("email", e.target.value)}
            />
            <Input
              placeholder="Phone"
              value={draft.from.phone}
              onChange={(e) => handleFromChange("phone", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <h3 className="mb-2 font-semibold">Items</h3>
        <div className="space-y-3">
          {draft.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 items-center gap-2 rounded-md border p-3"
            >
              <div className="col-span-5">
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", Number(e.target.value))
                  }
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) =>
                    handleItemChange(index, "rate", Number(e.target.value))
                  }
                />
              </div>
              <div className="col-span-2">
                <Input type="number" disabled value={item.amount} />
              </div>
              <div className="col-span-1 text-right">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(index)}
                >
                  X
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button type="button" className="mt-3" onClick={addItem}>
          + Add Item
        </Button>
      </div>

      {/* Tax / Payment / Notes */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Tax Rate (%)</Label>
          <Input
            type="number"
            value={draft.taxRate}
            onChange={(e) => handleChange("taxRate", Number(e.target.value))}
          />
        </div>
        <div>
          <CurrencySelect />
        </div>
      </div>

      <div>
        <Label>Payment Details</Label>
        <Input
          value={draft.paymentDetails}
          onChange={(e) => handleChange("paymentDetails", e.target.value)}
        />
      </div>
      <div>
        <Label>Custom Notes</Label>
        <Input
          value={draft.customNotes}
          onChange={(e) => handleChange("customNotes", e.target.value)}
        />
      </div>

      {/* Save */}
      <Button type="submit" className="w-full" disabled={isSaving}>
        Save Invoice
      </Button>
    </form>
  );
}
