import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Text, TextField, View } from 'react-native-ui-lib'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import TextFieldError from '@/components/TextFieldError'
import { usersApi } from '@/apis/users'
import { useAuth0 } from 'react-native-auth0'
import { useRouter } from 'expo-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert } from 'react-native'

const validationSchema = yup.object().shape({
  email: yup.string().email().trim().required(),
  firstName: yup.string().trim().required(),
  lastName: yup.string().trim().required()
})

export default function RegisterScreen() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuth0()
  const {
    formState: { errors, isSubmitting },
    control,
    handleSubmit
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const { mutate: createUser } = useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['user-info'],
        type: 'all'
      })
      router.replace('/(protected)/')
    },
    onError: (error: any) => {
      console.error(error)
    }
  })

  const onSubmit = handleSubmit((data) => {
    if (!user?.name) {
      Alert.alert('กรุณาเข้าสู่ระบบก่อน')
      return
    }
    createUser({
      phoneNumber: user.name,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName
    })
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
          ลงทะเบียนใหม่
        </Text>
        <View gap-10>
          <Text bodyB>อีเมล</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="อีเมล"
              />
            )}
          />
          <TextFieldError errorMessage={errors.email?.message} />
        </View>
        <View gap-10>
          <Text bodyB>ชื่อ</Text>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="ชื่อ"
              />
            )}
          />
          <TextFieldError errorMessage={errors.firstName?.message} />
        </View>
        <View gap-10>
          <Text bodyB>นามสกุล</Text>
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="นามสกุล"
              />
            )}
          />
          <TextFieldError errorMessage={errors.lastName?.message} />
        </View>
        <Button
          marginT-20
          label="ลงทะเบียน"
          onPress={onSubmit}
          disabled={isSubmitting}
        />
      </View>
    </SafeAreaView>
  )
}
