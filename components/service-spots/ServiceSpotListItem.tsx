import React from 'react'
import { StyleSheet } from 'react-native'
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib'
import { FontAwesome5, Entypo } from '@expo/vector-icons'
import { ServiceSpot } from '../../apis/service-spots/type'
import { serviceSpotUtil } from '../../utils/service-spot'

type Props = {
  serviceSpot: ServiceSpot
  onPress?: ServiceSpotListItemPressHandler
}

export type ServiceSpotListItemPressHandler = (serviceSpot: ServiceSpot) => void

function ServiceSpotListItem({ serviceSpot, onPress }: Props) {
  const handlePress = () => {
    onPress?.(serviceSpot)
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.container}
      activeOpacity={0.5}
    >
      <View row spread centerV>
        <View row center gap-10 paddingV-15>
          <View
            backgroundColor={Colors.$backgroundPrimaryHeavy}
            width={38}
            height={38}
            br100
            padding-5
            center
          >
            <FontAwesome5 name="map-marker-alt" size={24} color="white" />
          </View>
          <View>
            <Text h5>{serviceSpot.name}</Text>
            <Text caption>
              {serviceSpotUtil.getDistanceText(serviceSpot.distance!)}
            </Text>
          </View>
        </View>
        <Entypo name="chevron-thin-right" size={24} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '#DCDCDC',
    borderBottomWidth: 1
  }
})

export default ServiceSpotListItem
