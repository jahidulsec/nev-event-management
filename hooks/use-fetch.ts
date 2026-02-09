"use client";

import { response } from "@/lib/response";
import React from "react";

type responseType = typeof response;

export default function useFetch<T>({ action }: { action: () => Promise<T> }) {
  const [isLoading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();

    const handleFetchData = async () => {
      setLoading(true);
      await action();
    };
  }, []);

  return { loading: isLoading };
}
