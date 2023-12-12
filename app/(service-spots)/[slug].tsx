import { Stack, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { Alert, Linking, StyleSheet } from 'react-native'
import { View, Text, LoaderScreen, Button } from 'react-native-ui-lib'
import { useGetServiceSpotById } from '../../apis/service-spots'
import MapView, { MapMarker, PROVIDER_GOOGLE } from 'react-native-maps'
import { URLSearchParams } from 'react-native-url-polyfill'
import { useGetDriverByUid } from '../../apis/drivers'

type Params = {
  slug: string
}

function ServiceSpotDetail() {
  const { slug } = useLocalSearchParams<Params>()

  const { data: serviceSpot } = useGetServiceSpotById(parseInt(slug))
  const { data: serviceSpotOwner } = useGetDriverByUid(
    serviceSpot?.serviceSpotOwnerUid
  )

  const shouldDisableRouteButton = useMemo(() => {
    return !serviceSpot?.coords.lat || !serviceSpot?.coords.lng
  }, [serviceSpot?.coords.lat, serviceSpot?.coords.lng])

  const openRouteViewInMapApplication = useCallback(async () => {
    const searchParams = new URLSearchParams()
    searchParams.append('api', '1')
    searchParams.append(
      'destination',
      `${serviceSpot?.coords.lat},${serviceSpot?.coords.lng}`
    )
    const url = `https://www.google.com/maps/dir/?${searchParams.toString()}`
    const supported = await Linking.canOpenURL(url)

    if (!supported) {
      Alert.alert('ไม่สามารถเปิดแผนที่ได้')
    }
    await Linking.openURL(url)
  }, [serviceSpot?.coords.lat, serviceSpot?.coords.lng])

  if (!serviceSpot) {
    return <LoaderScreen />
  }

  return (
    <View flex-1>
      <Stack.Screen options={{ title: serviceSpot?.name }} />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: serviceSpot.coords.lat || 0,
          longitude: serviceSpot.coords.lng || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
        maxZoomLevel={15}
        minZoomLevel={15}
        showsUserLocation
      >
        <MapMarker
          key={serviceSpot?.id}
          coordinate={{
            latitude: serviceSpot.coords.lat || 0,
            longitude: serviceSpot.coords.lng || 0
          }}
        />
      </MapView>
      <View row padding-10 width="100%">
        <View flex>
          <View marginV-10>
            <Text h4>ที่อยู่</Text>
          </View>
          <Text>
            {serviceSpot.addressLine1} {serviceSpot?.addressLine2 || ''}{' '}
            {
              // @ts-ignore
              serviceSpot.address.nameTH
            }{' '}
            {
              // @ts-ignore
              serviceSpot.address.district.nameTH
            }{' '}
            {
              // @ts-ignore
              serviceSpot.address.district.province.nameTH
            }
          </Text>
        </View>
        <View right>
          <Button
            onPress={openRouteViewInMapApplication}
            disabled={shouldDisableRouteButton}
          >
            <Text white>เส้นทาง</Text>
          </Button>
        </View>
      </View>
      <View padding-10 width="100%">
        <Text h4>หัวหน้าวิน</Text>
        <Text>
          {serviceSpotOwner?.firstName} {serviceSpotOwner?.lastName}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 200
  }
})

export default ServiceSpotDetail
