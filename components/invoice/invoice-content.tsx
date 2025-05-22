"use client";

import { useInvoiceDraftStore } from "@/stores/invoiceStore";

export default function InvoiceContent() {
  const { draft } = useInvoiceDraftStore();

  const subtotal = draft?.lineItems?.items.reduce(
    (sum: number, item: any) => sum + item.quantity * item.rate,
    0,
  );
  const tax = parseInt(draft?.invoiceDetails?.tax || "0");
  const credit = parseInt(draft?.invoiceDetails?.credit || "0");
  const taxAmount = subtotal * (tax / 100);
  const total = subtotal + taxAmount;

  return (
    <div className="rounded-md bg-white p-8 text-sm leading-snug text-gray-800 shadow">
      {/* Header */}
      {draft.status === "PAID" && (
        <div className="mb-4 text-right">
          <span className="border border-b border-green-600 px-4 py-1 text-sm font-medium uppercase text-green-600">
            {draft.status}
          </span>
        </div>
      )}

      <div className="mb-8 flex justify-between">
        <div>
          <p className="mb-2 text-lg font-semibold">
            {draft?.freelancerInfo?.name}
          </p>
          <div>{draft?.freelancerInfo?.email}</div>
          <div>{draft?.freelancerInfo?.phone}</div>
          <div>{draft?.freelancerInfo?.address}</div>
        </div>
        <div className="text-right">
          <p className="mb-2 text-xl font-bold text-gray-900">Invoice</p>
          <div>
            Invoice #:{" "}
            <span className="font-medium">{draft?.invoiceNumber}</span>
          </div>
          <div>
            Date:{" "}
            <span className="font-medium">
              {draft?.invoiceDetails?.issueDate
                ? new Date(
                    draft?.invoiceDetails?.issueDate,
                  ).toLocaleDateString()
                : "—"}
            </span>
          </div>
          <div>
            Due:{" "}
            <span className="font-medium">
              {draft?.invoiceDetails?.dueDate
                ? new Date(draft?.invoiceDetails?.dueDate).toLocaleDateString()
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Client & Payment */}
      <div className="mb-8 flex justify-between">
        <div>
          <p className="mb-2 font-semibold">Bill To</p>
          <div>{draft?.clientInfo?.clientName}</div>
          <div>{draft?.clientInfo?.clientEmail}</div>
          <div>{draft?.clientInfo?.clientPhone}</div>
          <div>{draft?.clientInfo?.clientAddress}</div>
        </div>
        <div className="text-right">
          <p className="mb-2 font-semibold">Payment Details</p>
          <div className="whitespace-pre-line">
            {draft?.paymentTerms?.paymentMethod}
            <br />
            {draft?.paymentTerms?.depositAmount
              ? `Deposit required: ${draft?.invoiceDetails?.currency} ${draft?.paymentTerms?.depositAmount}`
              : ""}
          </div>
        </div>
      </div>

      {/* Line Items */}
      <table className="mb-6 w-full">
        <thead>
          <tr className="bg-gray-50 text-left font-semibold text-gray-600">
            <th className="py-2">Description</th>
            <th className="py-2">Quantity</th>
            <th className="py-2">Unit Price</th>
            <th className="py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {draft?.lineItems?.items?.map((item: any, i: number) => (
            <tr key={i} className="border-b border-gray-200 last:border-none">
              <td className="py-3">{item.description}</td>
              <td className="py-3">{item.quantity}</td>
              <td className="py-3">
                {draft?.invoiceDetails?.currency} {item.rate.toFixed(2)}
              </td>
              <td className="py-3">
                {draft?.invoiceDetails?.currency}{" "}
                {(item.quantity * item.rate).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mb-8 space-y-1 text-right text-gray-700">
        <p>
          Subtotal: {draft?.invoiceDetails?.currency} {subtotal.toFixed(2)}
        </p>
        {tax > 0 && (
          <p>
            Tax ({tax}%): {draft?.invoiceDetails?.currency}{" "}
            {taxAmount.toFixed(2)}
          </p>
        )}
        {credit > 0 && (
          <p className="text-sm font-bold text-green-700">
            Credit: -{draft?.invoiceDetails?.currency} {credit.toFixed(2)}
          </p>
        )}
        <p className="text-xl font-bold">
          Total: {draft?.invoiceDetails?.currency} {(total - credit).toFixed(2)}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 text-gray-600">
        <p className="mb-4 whitespace-pre-line">{draft?.customNote}</p>
        <p className="text-center text-xs italic text-gray-400">
          Created with{" "}
          <a
            href={process.env.NEXT_PUBLIC_APP_URL}
            className="underline"
            target="_blank"
          >
            {process.env.NEXT_PUBLIC_APP_URL}
          </a>
        </p>
      </div>
    </div>
  );
}
