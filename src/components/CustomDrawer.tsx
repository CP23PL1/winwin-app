import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer'
import { Button, Colors, Dividers, Text, View } from 'react-native-ui-lib'
import { User } from '@/apis/users/type'

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
      <View padding-15>
        <Button
          label="ออกจากระบบ"
          $textDanger
          backgroundColor={Colors.$backgroundDangerLight}
          onPress={onLogout}
        />
      </View>
    </DrawerContentScrollView>
  )
}
