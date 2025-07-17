// hooks/useUser.ts
import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data.user);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
}
