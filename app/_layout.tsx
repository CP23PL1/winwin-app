import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import React, { useEffect } from 'react'
import { QueryClientProvider } from '../providers/query-client'
import 'react-native-url-polyfill/auto'
import { DesignSystem } from '../utils/design-system'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
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
      DesignSystem.setup()
    }
  }, [fontsLoaded])

  return (
    <QueryClientProvider>
      <Stack
        screenOptions={{
          headerTitleAlign: 'center'
        }}
      />
    </QueryClientProvider>
  )
}
