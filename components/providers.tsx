"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ErrorBoundary level="critical" showDetails={false}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <AnalyticsProvider>
              <WebSocketProvider>
                <LanguageProvider>
                  {children}
                </LanguageProvider>
              </WebSocketProvider>
            </AnalyticsProvider>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}