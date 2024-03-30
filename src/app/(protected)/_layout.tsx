import { Redirect, Slot } from 'expo-router'
import { LoaderScreen } from 'react-native-ui-lib'

import { useAuth0 } from 'react-native-auth0'
import { useQuery } from '@tanstack/react-query'
import { usersApi } from '@/apis/users'
import DriveRequestContextProvider from '@/contexts/DriveRequestContext'

export default function ProtectedLayout() {
  const { user, isLoading: isAuth0Loading, clearSession } = useAuth0()

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
    <DriveRequestContextProvider>
      <Slot />
    </DriveRequestContextProvider>
  )
}
