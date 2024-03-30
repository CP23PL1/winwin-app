import { Avatar, Colors, Text, View } from 'react-native-ui-lib'

type Props = {
  driver: Driver
}
export default function DriverInfo({ driver }: Props) {
  return (
    <View row gap-15>
      <Avatar
        source={{
          uri: driver.info.profileImage
        }}
      />
      <View>
        <Text bodyB>
          {driver.info.firstName} {driver.info.lastName}
        </Text>
        <Text caption color={Colors.$textNeutral}>
          วินหมายเลข {driver.info.no}
        </Text>
      </View>
    </View>
  )
}
