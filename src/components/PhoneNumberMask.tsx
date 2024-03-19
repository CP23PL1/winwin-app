import React from 'react'
import { View, Text, Colors } from 'react-native-ui-lib'
import { StyleSheet } from 'react-native'

type Props = {
  dialCode: string
  value?: string
}

function PhoneNumberMask({ dialCode, value }: Props) {
  return (
    <View row gap-10 style={[styles.container]}>
      <Text h4>{dialCode}</Text>
      <Text h4>{value?.slice(0, 2)}</Text>
      <Text h4>{value?.slice(2, 5)}</Text>
      <Text h4>{value?.slice(5, 9)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.$backgroundPrimaryHeavy,
    borderBottomWidth: 1
  }
})

export default PhoneNumberMask
