import { useFonts } from 'expo-font'
import { SplashScreen, Stack, useNavigation } from 'expo-router'
import React, { useEffect } from 'react'
import { QueryClientProvider } from '../providers/query-client'
import 'react-native-url-polyfill/auto'
import { DesignSystem } from '../utils/design-system'
import { StyleSheet } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { Colors, LoaderScreen, Text } from 'react-native-ui-lib'

DesignSystem.setup()
SplashScreen.preventAutoHideAsync()

function RootLayout() {
  const navigation = useNavigation()
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

  if (!fontsLoaded) {
    return <LoaderScreen />
  }

  return (
    <QueryClientProvider>
      <Stack
        screenOptions={{
          headerLeft: (props) =>
            props.canGoBack && (
              <Entypo
                name="chevron-thin-left"
                size={24}
                color="white"
                onPress={navigation.goBack}
              />
            ),
          headerTitle: (props) => (
            <Text h4 white>
              {props.children}
            </Text>
          ),
          headerStyle: {
            backgroundColor: Colors.$backgroundPrimaryHeavy
          },
          headerBackVisible: false,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          contentStyle: [styles.container]
        }}
      />
    </QueryClientProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F0F0'
  }
})

export default RootLayout
