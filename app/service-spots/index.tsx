import { Stack } from 'expo-router'
import React from 'react'
import { View, Text } from 'react-native-ui-lib'
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
    <View>
      <Stack.Screen
        options={{
          title: 'วินมอเตอร์ไซค์'
        }}
      />
      <View flex row spread>
        <Text text70>ระยะ {RADIUS / 1000} กม.</Text>
        <Text text70>ทั้งหมด {serviceSpots?.length || 0} แห่ง</Text>
      </View>
      <ServiceSpotList items={serviceSpots} radius={RADIUS} />
    </View>
  )
}
