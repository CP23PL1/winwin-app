import { Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Alert } from 'react-native'
import { useAuth0 } from 'react-native-auth0'
import OTPTextInput from 'react-native-otp-textinput'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, Button } from 'react-native-ui-lib'
import { useQueryClient } from '@tanstack/react-query'

type Params = {
  phoneNumber: string
}

export default function OtpScreen() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { authorizeWithSMS } = useAuth0()
  const searchParams = useLocalSearchParams<Params>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const phoneNumber = useMemo(() => {
    if (!searchParams.phoneNumber) {
      return null
    }
    return decodeURIComponent(searchParams.phoneNumber)
  }, [searchParams.phoneNumber])

  const [code, setCode] = useState('')

  const handleAuthorizeWithSMS = async () => {
    if (!code) {
      return Alert.alert('กรุณากรอกรหัสผ่านชั่วคราว')
    }
    try {
      setIsSubmitting(true)
      await authorizeWithSMS({
        phoneNumber: phoneNumber!,
        code,
        audience: process.env.EXPO_PUBLIC_AUTH0_AUDIENCE,
        scope: process.env.EXPO_PUBLIC_AUTH0_SCOPE
      })
      await queryClient.invalidateQueries({
        queryKey: ['user-info'],
        type: 'all'
      })
      router.replace('/(protected)/')
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!phoneNumber) {
    return <Redirect href="/login" />
  }

  return (
    <SafeAreaView
      style={{
        justifyContent: 'space-between',
        height: '100%',
        padding: 24,
        gap: 20
      }}
    >
      <View centerV gap-20 height="100%">
        <Text center h1B>
          ยืนยัน OTP
        </Text>
        <View center>
          <Text>
            กรอก <Text bodyB>รหัสผ่านชั่วคราว</Text>
          </Text>
          <Text>
            ที่ได้รับส่งไปยังหมายเลข <Text bodyB>{phoneNumber}</Text>
          </Text>
        </View>
        <OTPTextInput
          autoFocus
          textInputStyle={{
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 10,
            borderBottomWidth: 1,
            width: 65,
            aspectRatio: 1 / 1
          }}
          inputCount={4}
          tintColor={'#FBDAAB'}
          offTintColor={'#FBDAAB'}
          handleTextChange={setCode}
        />

        <Button
          marginT-20
          label="ยืนยัน"
          onPress={handleAuthorizeWithSMS}
          disabled={code.length < 4 || isSubmitting}
        />
      </View>
    </SafeAreaView>
  )
}
