import React from 'react'
import { Colors, View, Text } from 'react-native-ui-lib'
import { ServiceSpot } from '@/apis/service-spots/type'
import { Entypo, AntDesign } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'
import { serviceSpotUtil } from '@/utils/service-spot'

type Props = {
  serviceSpot: ServiceSpot
}

export default function ServiceSpotCallout({ serviceSpot }: Props) {
  return (
    <View>
      <View style={styles.bubble}>
        <Text bodyB>{serviceSpot.name}</Text>
        <Text caption>
          {serviceSpot.addressLine1} {serviceSpot.addressLine2}
        </Text>
        <Text caption>
          {serviceSpotUtil.getDistanceText(serviceSpot.distance!)}
        </Text>

        <View row centerV right>
          <Text caption color={Colors.$iconPrimary}>
            ดูรายละเอียด
          </Text>
          <Entypo
            name="chevron-thin-right"
            size={12}
            color={Colors.$iconPrimary}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 0.5,
    padding: 10,
    elevation: 5,
    minWidth: 200
  }
})
