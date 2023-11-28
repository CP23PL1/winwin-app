import { Link, Stack } from 'expo-router'
import React from 'react'
import { View, Text } from 'react-native-ui-lib'

export default function Home() {
  return (
    <View>
      <Stack.Screen
        options={{
          title: 'Home'
        }}
      />
      <Link href="/service-spots/">Home</Link>
    </View>
  )
}
