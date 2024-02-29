import { Stack, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { View, Text, LoaderScreen, Button } from 'react-native-ui-lib'
import { useLocation } from '../../hooks/useLocation'
import ServiceSpotList from '../../components/service-spots/ServiceSpotList'
import { ServiceSpotListItemPressHandler } from '../../components/service-spots/ServiceSpotListItem'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler'
import { useQuery } from '@tanstack/react-query'
import { serviceSpotsApi } from '../../apis/service-spots'
import { NEARBY_RADIUS } from '../../constants/service-spots'
import { useAuth0 } from 'react-native-auth0'

export default function ServiceSpots() {
  const router = useRouter()
  const { clearCredentials } = useAuth0()
  const { location } = useLocation()

  const [refreshing, setRefreshing] = useState(false)

  const { data: serviceSpots, refetch } = useQuery({
    queryKey: ['service-spots'],
    queryFn: () =>
      serviceSpotsApi.getNearbyServiceSpots({
        lat: location?.coords.latitude,
        lng: location?.coords.longitude,
        radius: NEARBY_RADIUS
      }),
    enabled: !!location
  })

  const handleItemPress: ServiceSpotListItemPressHandler = (serviceSpot) => {
    router.push(`/(protected)/service-spots/${serviceSpot.id}`)
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [])

  const signOut = () => {
    clearCredentials()
  }

  return (
    <View flex>
      <Stack.Screen options={{ title: 'วินมอเตอร์ไซค์' }} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View padding-15>
          <View row spread>
            <Text caption>ระยะ {NEARBY_RADIUS / 1000} กม.</Text>
            <Text caption>ทั้งหมด {serviceSpots?.length || 0} แห่ง</Text>
          </View>
          {serviceSpots ? (
            <View>
              <ServiceSpotList
                items={serviceSpots}
                onItemPress={handleItemPress}
              />
            </View>
          ) : (
            <View center marginV-20>
              <LoaderScreen message="ค้นหาวินมอเตอร์ไซค์ใกล้คุณ..." />
            </View>
          )}
        </View>
      </ScrollView>
      <View center paddingB-5>
        <Button
          avoidInnerPadding
          avoidMinWidth
          bg-transparent
          onPress={() => signOut()}
        >
          <Text red>ออกจากระบบ</Text>
        </Button>
      </View>
    </View>
  )
}
