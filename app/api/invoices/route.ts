import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { createInvoiceNumber, createOrUpdateInvoice } from "@/lib/invoice";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const invoices = await prisma.invoice.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit, // only applied if limit is defined
    });

    return NextResponse.json(invoices);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { draft } = await req.json();
    const draftNumber = await createInvoiceNumber(user.id);
    const invoice = await createOrUpdateInvoice(null, user.id, {
      ...draft,
      number: draftNumber,
    });
    console.log("invoice", invoice);
    return NextResponse.json(invoice);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
