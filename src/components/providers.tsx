'use client'

import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { AuthProvider } from './providers/auth-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  // const [queryClient] = useState(
  //   () =>
  //     new QueryClient({
  //       defaultOptions: {
  //         queries: {
  //           staleTime: 60 * 1000, // 1 minute
  //           refetchOnWindowFocus: false,
  //         },
  //       },
  //     })
  // )

    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: { staleTime: 60_000, refetchOnWindowFocus: false },
                },
            })
    )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>

      // <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      //     <QueryClientProvider client={queryClient}>
      //         <AuthProvider>
      //             {children}
      //             <ReactQueryDevtools initialIsOpen={false} />
      //         </AuthProvider>
      //     </QueryClientProvider>
      // </ThemeProvider>
  )
}
