import { useInvoiceStore } from "@/stores/invoiceStore";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const popularCurrencies = [
  { code: "USD", name: "US Dollar ($)" },
  { code: "EUR", name: "Euro (€)" },
  { code: "GBP", name: "British Pound (£)" },
  { code: "JPY", name: "Japanese Yen (¥)" },
  { code: "CNY", name: "Chinese Yuan (¥)" },
  { code: "INR", name: "Indian Rupee (₹)" },
  { code: "CAD", name: "Canadian Dollar (C$)" },
  { code: "AUD", name: "Australian Dollar (A$)" },
  { code: "CHF", name: "Swiss Franc (CHF)" },
  { code: "SEK", name: "Swedish Krona (kr)" },
  { code: "NOK", name: "Norwegian Krone (kr)" },
  { code: "SGD", name: "Singapore Dollar (S$)" },
  { code: "ZAR", name: "South African Rand (R)" },
  { code: "TRY", name: "Turkish Lira (₺)" },
  { code: "MGA", name: "Malagasy Ariary (Ar)" },
];

export function CurrencySelect() {
  const { draft, setCurrency } = useInvoiceStore();

  return (
    <div className="">
      <Label>Currency</Label>
      <Select
        value={draft.currency}
        onValueChange={(value) => setCurrency(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          {popularCurrencies.map((cur) => (
            <SelectItem key={cur.code} value={cur.code}>
              {cur.code} — {cur.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
