import "server-only";

import { cache } from "react";
import { auth } from "@/auth";

import { prisma } from "./db";

export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    // const userId = process.env.TEST_USER_ID;
    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    // });
    // return user;
    return undefined;
  }
  return session.user;
});

export const getTestingUser = cache(async () => {
  const userId = process.env.TEST_USER_ID;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user;
});
