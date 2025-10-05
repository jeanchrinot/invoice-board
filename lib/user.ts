import { prisma } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        name: true,
        emailVerified: true,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};

export async function getCurrentMonthlyUsage(userId: string) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // JS months are 0-indexed

  const usage = await prisma.monthlyUsage.upsert({
    where: {
      userId_year_month: { userId, year, month },
    },
    update: {},
    create: {
      userId,
      year,
      month,
    },
  });

  return usage;
}
