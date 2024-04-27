import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer'
import { Button, Colors, Text, View } from 'react-native-ui-lib'
import { User } from '@/apis/users/type'
import * as Application from 'expo-application'

type Props = {
  user: User
  drawerContentComponentProps: DrawerContentComponentProps
  onLogout: () => void
}

export default function CustomDrawer({
  drawerContentComponentProps,
  user,
  onLogout
}: Props) {
  return (
    <DrawerContentScrollView
      {...drawerContentComponentProps}
      contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
    >
      <View gap-15>
        <View
          padding-15
          style={{ borderBottomWidth: 1, borderBottomColor: '#F5F5F5' }}
        >
          <Text bodyB>
            {user.firstName} {user.lastName}
          </Text>
          <Text caption $outlineDanger>
            {user.phoneNumber}
          </Text>
        </View>
        <View>
          <DrawerItemList {...drawerContentComponentProps} />
        </View>
      </View>
      <View padding-15 gap-15>
        <Button
          label="ออกจากระบบ"
          $textDanger
          backgroundColor={Colors.$backgroundDangerLight}
          onPress={onLogout}
        />
        <Text center color={Colors.$textNeutral} style={{ fontSize: 12 }}>
          เวอร์ชั่น {Application.nativeApplicationVersion}
        </Text>
      </View>
    </DrawerContentScrollView>
  )
}
