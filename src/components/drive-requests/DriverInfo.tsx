import { Avatar, Colors, Text, View } from 'react-native-ui-lib'
import { FontAwesome5 } from '@expo/vector-icons'
import { Driver } from '@/apis/shared/type'

type Props = {
  driver: Driver['info']
  renderVehicle?: (vehicle: Driver['info']['vehicle']) => React.ReactNode
  customAvatarComponent?: React.ReactNode
}
export default function DriverInfo({
  driver,
  customAvatarComponent,
  renderVehicle
}: Props) {
  return (
    <View row centerV gap-10>
      {driver.profileImage !== null ? (
        customAvatarComponent ? (
          customAvatarComponent
        ) : (
          <Avatar source={{ uri: driver.profileImage }} size={52} />
        )
      ) : (
        <View
          backgroundColor={Colors.$backgroundPrimaryMedium}
          br100
          center
          width={52}
          height={52}
        >
          <FontAwesome5 name="user-alt" size={22} color={Colors.$iconPrimary} />
        </View>
      )}
      <View>
        <Text bodyB>
          {driver.firstName} {driver.lastName}
        </Text>
        {renderVehicle && (
          <Text caption numberOfLines={1} ellipsizeMode="tail">
            {renderVehicle(driver.vehicle)}
          </Text>
        )}
        <Text caption>วินหมายเลข {driver.no}</Text>
      </View>
    </View>
  )
}
