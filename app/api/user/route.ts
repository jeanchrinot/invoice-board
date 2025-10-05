import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { getCurrentMonthlyUsage } from "@/lib/user";

export const GET = auth(async (req) => {
  if (!req.auth) {
    return new Response("Not authenticated", { status: 401 });
  }

  const currentUser = req.auth.user;
  if (!currentUser || !currentUser.id) {
    return new Response("Invalid user", { status: 401 });
  }

  // Get user montly usage
  const usage = await getCurrentMonthlyUsage(currentUser.id);
  const userPlan = await getUserSubscriptionPlan(currentUser.id);

  return NextResponse.json(
    { user: currentUser, usage, userPlan },
    { status: 200 },
  );
});

export const DELETE = auth(async (req) => {
  if (!req.auth) {
    return new Response("Not authenticated", { status: 401 });
  }

  const currentUser = req.auth.user;
  if (!currentUser) {
    return new Response("Invalid user", { status: 401 });
  }

  try {
    await prisma.user.delete({
      where: {
        id: currentUser.id,
      },
    });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }

  return new Response("User deleted successfully!", { status: 200 });
});
