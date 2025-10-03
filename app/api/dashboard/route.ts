import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get counts per status
    const grouped = await prisma.invoice.groupBy({
      by: ["status"],
      where: { userId: user.id },
      _count: { _all: true },
    });

    const counts = grouped.reduce(
      (acc, cur) => {
        acc[cur.status] = cur._count._all;
        return acc;
      },
      {} as Record<string, number>,
    );

    // 2. Calculate amountDue and amountPaid
    // const [amountDueResult, amountPaidResult] = await Promise.all([
    //   prisma.invoice.aggregate({
    //     where: {
    //       userId: user.id,
    //       status: { in: ["COMPLETE", "SENT", "OVERDUE"] },
    //     },
    //     _sum: { total: true },
    //   }),
    //   prisma.invoice.aggregate({
    //     where: {
    //       userId: user.id,
    //       status: "PAID",
    //     },
    //     _sum: { total: true },
    //   }),
    // ]);

    // const amountDue = amountDueResult._sum.total || 0;
    // const amountPaid = amountPaidResult._sum.total || 0;

    // 3. Map to frontend-friendly keys
    const result = {
      inProgress: counts["IN_PROGRESS"] || 0,
      complete: counts["COMPLETE"] || 0,
      cancelled: counts["CANCELLED"] || 0,
      sent: counts["SENT"] || 0,
      overdue: counts["OVERDUE"] || 0,
      paid: counts["PAID"] || 0,
      //   amountDue,
      //   amountPaid,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
