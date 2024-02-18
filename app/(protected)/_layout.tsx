import { Redirect, Stack, useNavigation } from 'expo-router'
import { Colors, LoaderScreen, Text } from 'react-native-ui-lib'
import { Entypo } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'
import { useAuth0 } from 'react-native-auth0'
import { useQuery } from 'react-query'
import { usersApi } from '../../apis/users'
import { UserIdentificationType } from '../../apis/users/type'

export default function ProtectedLayout() {
  const navigation = useNavigation()

  const { user, isLoading: isAuth0Loading } = useAuth0()
  const { data: userInfo, isLoading: isUserInfoLoading } = useQuery(
    ['user-info'],
    () => usersApi.getUserBy(user?.name!, UserIdentificationType.PHONE_NUMBER),
    {
      enabled: user?.name !== undefined
    }
  )
  console.log(user, userInfo, isAuth0Loading, isUserInfoLoading)
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
            {props.children}
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
