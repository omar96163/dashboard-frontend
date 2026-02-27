"use client";

import { useState } from "react";
import { QUERY_STALE_TIME } from "@/constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: QUERY_STALE_TIME.MEDIUM,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              // عدم إعادة المحاولة في حالة 401 أو 403
              if (
                error?.response?.status === 401 ||
                error?.response?.status === 403
              ) {
                return false;
              }
              // إعادة المحاولة حتى 3 مرات للأخطاء الأخرى
              return failureCount < 3;
            },
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
