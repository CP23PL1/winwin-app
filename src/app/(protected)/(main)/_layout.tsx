import React, { useCallback, useEffect, useRef, useState } from 'react'
import MapView, {
  Callout,
  Details,
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
  Region
} from 'react-native-maps'
import { LoaderScreen, View } from 'react-native-ui-lib'
import { StyleSheet } from 'react-native'
import { Slot, Stack, router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { serviceSpotsApi } from '@/apis/service-spots'
import { NEARBY_RADIUS } from '@/constants/service-spots'
import debounce from 'lodash.debounce'
import ServiceSpotCallout from '@/components/service-spots/ServiceSpotCallout'
import { isAxiosError } from 'axios'
import { mapUtil } from '@/utils/map'
import { useDriveRequestContext } from '@/contexts/DriveRequestContext'
import { driveRequestsApi } from '@/apis/drive-requests'

export default function MainLayout() {
  const { points, location, route, origin, setOrigin, destination, setRoute } =
    useDriveRequestContext()
  const map = useRef<MapView | null>(null)

  const [initialRegion, setInitialRegion] = useState<Region | null>(null)
  const [isRegionFirstChange, setIsRegionFirstChange] = useState(false)

  const { data: serviceSpots, refetch: refetchNearbyServiceSpots } = useQuery({
    queryKey: ['service-spots'],
    queryFn: () =>
      serviceSpotsApi.getNearbyServiceSpots({
        lat: destination?.location.lat ?? location?.coords.latitude,
        lng: destination?.location.lng ?? location?.coords.longitude,
        radius: NEARBY_RADIUS
      }),
    enabled: destination !== null || location !== null
  })

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
    if (!origin || !destination) return

    try {
      const data = await driveRequestsApi.previewRoute(
        origin.location,
        destination.location
      )
      const decodedPolyline = mapUtil.decodePolyline(
        data.polyline.encodedPolyline
      )
      setRoute(data)
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
    setOrigin({
      name: 'ตำแหน่งปัจจุบัน',
      location: {
        lat: location.coords.latitude,
        lng: location.coords.longitude
      }
    })
  }, [location])

  return !initialRegion ? (
    <LoaderScreen />
  ) : (
    <View flex>
      <MapView
        ref={map}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        onRegionChangeComplete={handleRegionChangeComplete}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton={false}
        showsUserLocation={!route}
        toolbarEnabled={false}
      >
        {destination && (
          <Marker
            coordinate={{
              latitude: destination.location.lat,
              longitude: destination.location.lng
            }}
            image={require('../../../../assets/map_marker_red.png')}
          />
        )}
        {points.length > 0 && (
          <Polyline
            coordinates={points}
            strokeColor="#7C89FF"
            strokeWidth={3}
          />
        )}
        {route && origin && (
          <Marker
            coordinate={{
              latitude: origin.location.lat,
              longitude: origin.location.lng
            }}
            image={require('../../../../assets/map_marker_blue.png')}
          />
        )}
        {serviceSpots?.map((serviceSpot) => (
          <Marker
            key={serviceSpot.id}
            coordinate={{
              latitude: serviceSpot.coords.lat,
              longitude: serviceSpot.coords.lng
            }}
            image={require('../../../../assets/map_marker_orange.png')}
          >
            <Callout
              tooltip
              onPress={() => router.push(`/service-spots/${serviceSpot.id}`)}
            >
              <ServiceSpotCallout serviceSpot={serviceSpot} />
            </Callout>
          </Marker>
        ))}
      </MapView>
      <Slot />
    </View>
  )
}
