import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export const POST = auth(async (req) => {
  if (!req.auth) {
    return new Response("Not authenticated", { status: 401 });
  }

  const currentUser = req.auth.user;
  if (!currentUser?.id) {
    return new Response("Invalid user", { status: 401 });
  }

  const { tokens } = await req.json();
  const userId = currentUser.id;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const usage = await prisma.monthlyUsage.upsert({
    where: {
      userId_year_month: { userId, year, month },
    },
    update: {
      tokens: { increment: tokens ?? 0 },
    },
    create: {
      userId,
      year,
      month,
      tokens: tokens ?? 0,
    },
  });

  return NextResponse.json({ status: 200, usage });
});
