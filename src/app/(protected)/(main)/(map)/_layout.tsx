import { usersApi } from '@/apis/users'
import CustomDrawer from '@/components/CustomDrawer'
import { useQuery } from '@tanstack/react-query'
import { Drawer } from 'expo-router/drawer'
import { useAuth0 } from 'react-native-auth0'
import { LoaderScreen } from 'react-native-ui-lib'

export default function MapLayout() {
  const { clearSession } = useAuth0()
  const { data: userInfo } = useQuery({
    queryKey: ['user-info'],
    queryFn: usersApi.getMyUserInfo
  })

  if (!userInfo) {
    return <LoaderScreen />
  }

  return (
    <Drawer
      detachInactiveScreens
      screenOptions={{
        headerTransparent: true,
        drawerStatusBarAnimation: 'fade',
        headerTitleStyle: { display: 'none' },
        drawerLabelStyle: {
          fontFamily: 'NotoSansThai'
        },
        drawerActiveTintColor: 'orange'
      }}
      drawerContent={(props) => (
        <CustomDrawer
          user={userInfo}
          drawerContentComponentProps={props}
          onLogout={clearSession}
        />
      )}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'หน้าแรก'
        }}
      />
      <Drawer.Screen
        name="drive-requests"
        options={{
          headerShown: false,
          drawerLabel: 'ประวัติการโดยสาร'
        }}
      />
    </Drawer>
  )
}
