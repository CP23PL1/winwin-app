import React, { useRef } from 'react'
import { useAuth0 } from 'react-native-auth0'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  Button,
  MaskedInput,
  Text,
  TextFieldRef,
  View
} from 'react-native-ui-lib'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import PhoneNumberMask from '../components/PhoneNumberMask'
import { THAI_DIAL_CODE, THAI_PHONE_NUMBER_LENGTH } from '../constants/phone'
import TextFieldError from '../components/TextFieldError'
import { useRouter } from 'expo-router'

const validationSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required('กรุณากรอกเบอร์โทรศัพท์')
    .matches(/^[0-9]+$/, 'กรุณากรอกเฉพาะตัวเลขเท่านั้น')
    .min(9)
    .max(9)
})

export default function LoginScreen() {
  const phoneNumberInput = useRef<TextFieldRef>(null)
  const router = useRouter()
  const { sendSMSCode } = useAuth0()

  const {
    formState: { errors, isSubmitting },
    control,
    handleSubmit
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const onSubmit = handleSubmit(async ({ phoneNumber }) => {
    const phoneNumberWithDialCode = `${THAI_DIAL_CODE}${phoneNumber}`
    try {
      await sendSMSCode({
        phoneNumber: phoneNumberWithDialCode
      })
      router.replace(
        `/otp/?phoneNumber=${encodeURIComponent(phoneNumberWithDialCode)}`
      )
    } catch (error) {
      console.log(error)
    }
  })

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
        <Text h1B center>
          เริ่มต้นใช้งาน
        </Text>
        <View gap-10>
          <Text bodyB>กรอกเบอร์โทรศัพท์</Text>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <MaskedInput
                migrate
                ref={phoneNumberInput}
                renderMaskedText={(value: string) => (
                  <PhoneNumberMask value={value} dialCode={THAI_DIAL_CODE} />
                )}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                maxLength={THAI_PHONE_NUMBER_LENGTH}
                keyboardType="numeric"
                autoFocus
              />
            )}
          />
          <TextFieldError errorMessage={errors.phoneNumber?.message} />
        </View>
        <Button
          marginT-20
          label="เข้าสู่ระบบ"
          onPress={onSubmit}
          disabled={isSubmitting}
        />
      </View>
    </SafeAreaView>
  )
}
