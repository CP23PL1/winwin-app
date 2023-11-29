import { Stack } from 'expo-router'
import React from 'react'
import { View, Text, Colors } from 'react-native-ui-lib'
import { useLocation } from '../../hooks/useLocation'
import { useGetServiceSpots } from '../../apis/service-spots'
import ServiceSpotList from '../../components/service-spots/ServiceSpotList'

const RADIUS = 5000

export default function ServiceSpots() {
  const currentLocation = useLocation()

  const { data: serviceSpots } = useGetServiceSpots(
    currentLocation?.coords.latitude,
    currentLocation?.coords.longitude,
    RADIUS
  )
  return (
    <View padding-15>
      <Stack.Screen
        options={{
          title: 'วินมอเตอร์ไซค์'
        }}
      />
      <View row spread>
        <Text caption>ระยะ {RADIUS / 1000} กม.</Text>
        <Text caption>ทั้งหมด {serviceSpots?.length || 0} แห่ง</Text>
      </View>
      <ServiceSpotList items={serviceSpots} />
    </View>
  )
}
