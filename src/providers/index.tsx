import React from 'react'
import { QueryClientProvider } from './query-client'
import { Auth0Provider } from 'react-native-auth0'

type Props = {
  readonly children: React.ReactNode
}

export default function AppProviders({ children }: Props) {
  return (
    <QueryClientProvider>
      <Auth0Provider
        domain={process.env.EXPO_PUBLIC_AUTH0_DOMAIN!}
        clientId={process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID!}
      >
        {children}
      </Auth0Provider>
    </QueryClientProvider>
  )
}
