// hooks/useUser.ts
import { useEffect, useState } from "react";

import { basicUsageLimit, guestUserLimit } from "@/config/user";

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data.user);
        setUsageLimit(basicUsageLimit);
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

  return { user, usageLimit, loading, error };
}
