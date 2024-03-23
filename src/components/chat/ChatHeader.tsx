import { router } from 'expo-router'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Colors, View, Image, Text } from 'react-native-ui-lib'
import { Ionicons } from '@expo/vector-icons'

type Props = {
  title: string
  image: string
  description: string
}

export default function ChatHeader({ title, image, description }: Props) {
  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        elevation: 10,
        padding: 20
      }}
    >
      <View row gap-10>
        <Button none avoidMinWidth avoidInnerPadding onPress={router.back}>
          <Ionicons name="arrow-back" size={24} color={Colors.black} />
        </Button>
        <View row gap-10 centerV>
          <Image
            src={image}
            style={{ width: 40, height: 40, borderRadius: 40 }}
          />
          <View>
            <Text h5B>{title}</Text>
            <Text caption>{description}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
