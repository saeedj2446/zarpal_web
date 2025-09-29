"use client"

import React, {useEffect} from "react";
import type { ReactNode } from "react";
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { store } from "../../lib/store/store"
import { Toaster } from "../radix/toaster"
import { ThemeProvider } from "../theme-provider"
import { DirectionProvider } from "@radix-ui/react-direction"
import TokenProvider from "@/components/providers/tokenProvider";
import SessionProvider from "@/components/providers/sessionProvider";
import {setRouter} from "@/lib/utils/router";
import {router} from "next/client"; // مسیر به AuthWrapper
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    setRouter(router);
  }, [router]);
  return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <DirectionProvider dir="rtl">
              <TokenProvider h={20}>
                <SessionProvider>
                  {children}
                </SessionProvider>
              </TokenProvider>
              <Toaster />
            </DirectionProvider>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
  )
}
