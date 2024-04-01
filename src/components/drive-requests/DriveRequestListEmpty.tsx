import { Colors, View, Text } from 'react-native-ui-lib'
import { Entypo } from '@expo/vector-icons'

export default function DriveRequestListEmpty() {
  return (
    <View flex center padding-20 gap-20>
      <Entypo
        name="documents"
        size={80}
        color={Colors.$backgroundNeutralHeavy}
        style={{ opacity: 0.4 }}
      />
      <View gap-5>
        <Text
          center
          h4
          color={Colors.$backgroundNeutralHeavy}
          style={{ opacity: 0.4 }}
        >
          ไม่พบประวัติการโดยสาร
        </Text>
        <Text
          center
          color={Colors.$backgroundNeutralHeavy}
          style={{ opacity: 0.4 }}
        >
          เริ่มเดินทางกับเราและเราจะแสดงประวัติการโดยสารของคุณที่นี่!
        </Text>
      </View>
    </View>
  )
}
