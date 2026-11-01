"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/features/users/libs/users";
import { users } from "@/lib/generated/prisma/client";

export function useUser(id?: string) {
  const [data, setData] = useState<users | null>(null);
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!id) return;

    let ignore = false;

    getUser(id).then((res) => {
      if (ignore) return;

      if (res.success) {
        setData(res.data ?? null);
      } else {
        setError(res.message ?? "Failed to fetch user");
      }

      setIsLoading(false);
    });

    return () => {
      ignore = true;
    };
  }, [id, reloadKey]);

  const refetch = () => {
    setIsLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  };

  return { data, isLoading, error, refetch };
}
