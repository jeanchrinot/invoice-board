import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { invoiceId: string } },
) {
  const { invoiceId } = params;

  try {
    const invoice = await prisma.invoiceDraft.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
