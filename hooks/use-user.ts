// hooks/useUser.ts
import { useEffect, useState } from "react";
import { useAssistantStore } from "@/stores/assistantStore";
import { MonthlyUsage } from "@prisma/client";

import { guestUserLimit, usageLimits } from "@/config/user";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type UsageLimit = {
  invoices: number;
  tokens: number;
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usageLimit, setUsageLimit] = useState<UsageLimit>({
    invoices: 0,
    tokens: 0,
  });
  const { setUsage } = useAssistantStore();
  const [planName, setPlanName] = useState<string>("Free");
  // const [usage, setUsage] = useState<MonthlyUsage>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data.user);
        setUsageLimit(
          data.userPlan?.title
            ? usageLimits[data.userPlan.title]
            : usageLimits["Free"],
        );
        setUsage(data.usage);
        setPlanName(data.userPlan?.title || "Free");
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        setUser(null);
        setUsageLimit(guestUserLimit);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, usageLimit, loading, error, planName };
}
