import { Stack, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { View, Text, LoaderScreen } from 'react-native-ui-lib'
import { useLocation } from '../../hooks/useLocation'
import { useGetServiceSpots } from '../../apis/service-spots'
import ServiceSpotList from '../../components/service-spots/ServiceSpotList'
import { ServiceSpotListItemPressHandler } from '../../components/service-spots/ServiceSpotListItem'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler'

const RADIUS = 2000

export default function ServiceSpots() {
  const router = useRouter()
  const currentLocation = useLocation()

  const [refreshing, setRefreshing] = useState(false)

  const { data: serviceSpots, refetch } = useGetServiceSpots(
    currentLocation?.coords.latitude,
    currentLocation?.coords.longitude,
    RADIUS
  )

  const handleItemPress: ServiceSpotListItemPressHandler = (serviceSpot) => {
    router.push(`/(service-spots)/${serviceSpot.id}`)
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [])

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Stack.Screen options={{ title: 'วินมอเตอร์ไซค์' }} />
      <View padding-15>
        <View row spread>
          <Text caption>ระยะ {RADIUS / 1000} กม.</Text>
          <Text caption>ทั้งหมด {serviceSpots?.length || 0} แห่ง</Text>
        </View>
        {serviceSpots ? (
          <ServiceSpotList items={serviceSpots} onItemPress={handleItemPress} />
        ) : (
          <View center marginV-20>
            <LoaderScreen message="ค้นหาวินมอเตอร์ไซค์ใกล้คุณ..." />
          </View>
        )}
      </View>
    </ScrollView>
  )
}
