import { Redirect, Stack, useNavigation } from 'expo-router'
import { Colors, LoaderScreen, Text } from 'react-native-ui-lib'
import { Entypo } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'
import { useAuth0 } from 'react-native-auth0'
import { useQuery } from '@tanstack/react-query'
import { usersApi } from '../../apis/users'

export default function ProtectedLayout() {
  const navigation = useNavigation()

  const { user, isLoading: isAuth0Loading } = useAuth0()

  const { data: userInfo, isLoading: isUserInfoLoading } = useQuery({
    queryKey: ['user-info'],
    queryFn: usersApi.getMyUserInfo
  })

  if (isAuth0Loading || isUserInfoLoading) {
    return <LoaderScreen />
  }

  if (!user) {
    return <Redirect href="/login" />
  }

  if (!userInfo) {
    return <Redirect href="/register" />
  }

  return (
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
            {props?.children || 'Loading...'}
          </Text>
        ),
        headerStyle: {
          backgroundColor: Colors.$backgroundPrimaryHeavy
        },
        headerBackVisible: false,
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        statusBarTranslucent: true,
        navigationBarHidden: true,
        contentStyle: [styles.container]
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F0F0'
  }
})
