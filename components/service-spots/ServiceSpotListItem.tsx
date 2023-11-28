import { ServiceSpotDto } from '@cp23pl1/winwin-client-sdk'
import React from 'react'
import { StyleSheet } from 'react-native'
import { View, Text } from 'react-native-ui-lib'
import { FontAwesome5 } from '@expo/vector-icons'
import { Link } from 'expo-router'

type Props = {
  serviceSpot: ServiceSpotDto
}

function ServiceSpotListItem({ serviceSpot }: Props) {
  const getDistanceText = (distance: number) => {
    if (distance < 1000) {
      return `${Math.floor(distance)} เมตร`
    }
    return `${(distance / 1000).toFixed(2)} กม.`
  }

  return (
    <Link href={`/service-spots/${serviceSpot.id}`} style={[styles.container]}>
      <View flex row gap-10 paddingV-15>
        <FontAwesome5 name="map-marker-alt" size={24} color="orange" />
        <View>
          <Text h5>{serviceSpot.name}</Text>
          <Text caption>
            ห่างจากคุณ {getDistanceText(serviceSpot.distance)}
          </Text>
        </View>
      </View>
    </Link>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1
  }
})

export default ServiceSpotListItem
