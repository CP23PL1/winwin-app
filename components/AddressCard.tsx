import React from 'react'
import { View, Colors, Text } from 'react-native-ui-lib'
import { FontAwesome5 } from '@expo/vector-icons'

type Props = {}

export default function AddressCard({}: Props) {
  return (
    <View
      bg-white
      marginT-20
      br50
      padding-20
      gap-10
      width="90%"
      style={{ elevation: 2 }}
    >
      {/* <View row centerV gap-10>
        <FontAwesome5
          name="map-marker-alt"
          size={20}
          color={Colors.$iconPrimary}
        />
        <View
          style={{
            width: 1,
            backgroundColor: '#6a6a6a',
            opacity: 0.2,
            height: '100%'
          }}
        />
        <Text color={Colors.$iconPrimary} style={{ opacity: 0.8 }}>
          เลือกวินมอเตอร์ไซค์
        </Text>
      </View> */}
      <View row centerV gap-10>
        <FontAwesome5 name="map-marker-alt" size={20} color={Colors.red40} />
        <View
          style={{
            width: 1,
            backgroundColor: '#6a6a6a',
            opacity: 0.2,
            height: '100%'
          }}
        />
        <Text color={Colors.$backgroundDark} style={{ opacity: 0.5 }}>
          ค้นหาปลายทางของคุณ
        </Text>
      </View>
    </View>
  )
}
