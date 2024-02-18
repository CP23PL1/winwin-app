import React from "react";
import { useForm, Controller } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, TextField, View } from "react-native-ui-lib";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import TextFieldError from "../components/TextFieldError";
import { usersApi } from "../apis/users";
import { useAuth0 } from "react-native-auth0";
import { useRouter } from "expo-router";
import { useQueryClient } from "react-query";

const validationSchema = yup.object().shape({
  email: yup.string().email().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
});

export default function RegisterScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth0();
  const {
    formState: { errors },
    control,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!user?.name) return console.error("Phone number is required");
    try {
      await usersApi.createUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: user?.name,
      });
      router.replace("/(protected)/");
      queryClient.invalidateQueries(["user-info"]);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <SafeAreaView
      style={{
        justifyContent: "space-between",
        height: "100%",
        padding: 24,
        gap: 20,
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
        <Button marginT-20 label="ลงทะเบียน" onPress={onSubmit} />
      </View>
    </SafeAreaView>
  );
}
