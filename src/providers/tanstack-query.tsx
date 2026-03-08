import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

let queryClientSingleton: QueryClient | undefined
export function getQueryClientSingleton() {
  if (queryClientSingleton) {
    return queryClientSingleton
  }

  const queryClient = new QueryClient()

  queryClientSingleton = queryClient
  return queryClientSingleton
}

type ProviderProps = Readonly<{
  children?: React.ReactNode
}>
export function TanStackQueryProvider(props: ProviderProps) {
  const { children } = props
  const queryClient = getQueryClientSingleton()

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
