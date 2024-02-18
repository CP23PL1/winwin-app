import { useFonts } from 'expo-font'
import { Slot, SplashScreen, useNavigation } from 'expo-router'
import React, { useEffect } from 'react'
import { QueryClientProvider } from '../providers/query-client'
import 'react-native-url-polyfill/auto'
import { DesignSystem } from '../utils/design-system'
import { Auth0Provider } from 'react-native-auth0'

DesignSystem.setup()
SplashScreen.preventAutoHideAsync()

function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    NotoSansThai: require('../assets/fonts/NotoSansThai-Regular.ttf'),
    NotoSansThaiBold: require('../assets/fonts/NotoSansThai-Bold.ttf')
  })

  useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  return (
    <QueryClientProvider>
      <Auth0Provider
        domain={process.env.EXPO_PUBLIC_AUTH0_DOMAIN!}
        clientId={process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID!}
      >
        <Slot />
      </Auth0Provider>
    </QueryClientProvider>
  )
}

export default RootLayout
