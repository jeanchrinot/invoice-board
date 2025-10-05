import { useInvoiceStore } from "@/stores/invoiceStore";
import { DraftStatus } from "@prisma/client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StatusSelect() {
  const { draft, setStatus } = useInvoiceStore();

  return (
    <div className="">
      <Label>Status</Label>
      <Select value={draft.status} onValueChange={(value) => setStatus(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(DraftStatus).map((status) => (
            <SelectItem key={status} value={status}>
              {status.replace("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
