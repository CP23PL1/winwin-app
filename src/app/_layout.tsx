import { useFonts } from 'expo-font'
import { Slot, SplashScreen } from 'expo-router'
import React, { useEffect } from 'react'
import { DesignSystem } from '@/utils/design-system'
import Toast from 'react-native-toast-message'
import { toastConfig } from '@/libs/toasts'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import AppProviders from '@/providers'
import * as Sentry from '@sentry/react-native'

DesignSystem.setup()
SplashScreen.preventAutoHideAsync()

Sentry.init({
  dsn: 'https://6fef9d185e0ed9f85b80c43d52e051f0@o4507040207994880.ingest.us.sentry.io/4507113206185984',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.7 : 1.0
})

function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    NotoSansThai: require('../../assets/fonts/NotoSansThai-Regular.ttf'),
    NotoSansThaiBold: require('../../assets/fonts/NotoSansThai-Bold.ttf')
  })

  useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  if (!fontsLoaded) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <Slot />
      </AppProviders>
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  )
}

export default Sentry.wrap(RootLayout)
