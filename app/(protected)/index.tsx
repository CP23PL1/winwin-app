import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MapView, {
  Callout,
  Details,
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
  Region
} from 'react-native-maps'
import { LoaderScreen, View, Button, Text } from 'react-native-ui-lib'
import { useLocation } from '../../hooks/useLocation'
import { StyleSheet } from 'react-native'
import { Stack, router } from 'expo-router'
import { GooglePlaceDetail } from 'react-native-google-places-autocomplete'
import { useQuery } from '@tanstack/react-query'
import { serviceSpotsApi } from '../../apis/service-spots'
import { NEARBY_RADIUS } from '../../constants/service-spots'
import debounce from 'lodash.debounce'
import ServiceSpotCallout from '../../components/service-spots/ServiceSpotCallout'
import { isAxiosError } from 'axios'
import { serviceSpotUtil } from '../../utils/service-spot'
import { mapUtil } from '../../utils/map'
import { googleApi } from '../../apis/google'
import { SafeAreaView } from 'react-native-safe-area-context'
import RouteCard from '../../components/RouteCard'

export default function RootProtectedScreen() {
  const { location } = useLocation()
  const map = useRef<MapView | null>(null)

  const [origin, setOrigin] = useState<GooglePlaceDetail | null>(null)
  const [destination, setDestination] = useState<GooglePlaceDetail | null>(null)
  const [initialRegion, setInitialRegion] = useState<Region | null>(null)
  const [isRegionFirstChange, setIsRegionFirstChange] = useState(false)

  const [route, setRoute] = useState<any>()
  const [points, setPoints] = useState<LatLng[]>([])

  const { data: serviceSpots, refetch: refetchNearbyServiceSpots } = useQuery({
    queryKey: ['service-spots'],
    queryFn: () =>
      serviceSpotsApi.getNearbyServiceSpots({
        lat: destination?.geometry.location.lat ?? location?.coords.latitude,
        lng: destination?.geometry.location.lng ?? location?.coords.longitude,
        radius: NEARBY_RADIUS
      }),
    enabled: destination !== null || location !== null
  })
  const shouldDisableDriveRequestButton = useMemo(() => {
    return !origin || !destination
  }, [origin, destination])

  const formattedPrice = useMemo(() => {
    if (!route) return
    const nf = new Intl.NumberFormat('th-TH', {
      currency: 'THB',
      style: 'currency',
      minimumFractionDigits: 0
    })
    return nf.format(
      serviceSpotUtil.calculatePrice(route.distanceMeters / 1000)
    )
  }, [route?.distanceMeters])

  const handleRegionChangeComplete = useCallback(
    debounce((_, details: Details) => {
      if (details.isGesture) return
      if (!isRegionFirstChange) {
        setIsRegionFirstChange(true)
        return
      }
      refetchNearbyServiceSpots()
    }, 1000),
    [isRegionFirstChange]
  )

  const fetchRoutes = useCallback(async () => {
    if (!origin?.place_id || !destination?.place_id) return
    try {
      const data = await googleApi.getRoutes({
        origin: {
          placeId: origin.place_id
        },
        destination: {
          placeId: destination.place_id
        },
        travelMode: 'TWO_WHEELER',
        languageCode: 'th-TH',
        units: 'METRIC'
      })
      const decodedPolyline = mapUtil.decodePolyline(
        data.routes[0].polyline.encodedPolyline
      )
      setRoute({
        duration: data.routes[0].duration,
        distanceMeters: data.routes[0].distanceMeters
      })
      setPoints(decodedPolyline)
      map.current?.fitToCoordinates(decodedPolyline, {
        edgePadding: {
          top: 100,
          right: 100,
          bottom: 100,
          left: 100
        }
      })
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error.response?.data)
      }
    }
  }, [map.current, origin, destination])

  useEffect(() => {
    fetchRoutes()
  }, [fetchRoutes])

  useEffect(() => {
    if (!location) return
    setInitialRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    })
  }, [location])

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {!initialRegion ? (
        <LoaderScreen />
      ) : (
        <View height="100%">
          <MapView
            ref={map}
            style={StyleSheet.absoluteFill}
            initialRegion={initialRegion}
            onRegionChangeComplete={handleRegionChangeComplete}
            provider={PROVIDER_GOOGLE}
            showsMyLocationButton={false}
            showsUserLocation
          >
            {destination && (
              <Marker
                coordinate={{
                  latitude: destination.geometry.location.lat,
                  longitude: destination.geometry.location.lng
                }}
                image={require('../../assets/map_marker_red.png')}
              />
            )}
            {points.length > 0 ? (
              <>
                <Polyline
                  coordinates={points}
                  strokeColor="#7C89FF"
                  strokeWidth={3}
                />
                <Marker
                  coordinate={{
                    latitude: origin?.geometry.location.lat!,
                    longitude: origin?.geometry.location.lng!
                  }}
                  image={require('../../assets/map_marker_blue.png')}
                />
              </>
            ) : (
              <></>
            )}
            {serviceSpots?.map((serviceSpot) => (
              <Marker
                key={serviceSpot.id}
                coordinate={{
                  latitude: serviceSpot.coords.lat,
                  longitude: serviceSpot.coords.lng
                }}
                image={require('../../assets/map_marker_orange.png')}
              >
                <Callout
                  tooltip
                  onPress={() =>
                    router.push(`/service-spots/${serviceSpot.id}`)
                  }
                >
                  <ServiceSpotCallout serviceSpot={serviceSpot} />
                </Callout>
              </Marker>
            ))}
          </MapView>
          <SafeAreaView style={{ marginTop: 10, alignItems: 'center' }}>
            <RouteCard
              origin={origin}
              destination={destination}
              onOriginChange={setOrigin}
              onDestinationChange={setDestination}
            />
          </SafeAreaView>
          <View absB absL bg-white padding-15 style={styles.footer}>
            {route && (
              <View row centerH spread paddingH-15 marginB-15>
                <View>
                  <Text caption>ระยะทางและเวลา</Text>
                  <Text body>
                    {Math.round(route.duration.split('s')[0] / 60)} นาที (
                    {serviceSpotUtil.getDistanceText(route.distanceMeters)})
                  </Text>
                </View>
                <View right>
                  <Text caption>ค่าโดยสาร (ตามอัตรา)</Text>
                  <Text h4B>{formattedPrice}</Text>
                </View>
              </View>
            )}
            <Button label="ยืนยัน" disabled={shouldDisableDriveRequestButton} />
          </View>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  }
})
