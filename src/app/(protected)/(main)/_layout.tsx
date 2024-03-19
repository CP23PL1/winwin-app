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
import { Slot, router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { serviceSpotsApi } from '@/apis/service-spots'
import { NEARBY_RADIUS } from '@/constants/service-spots'
import debounce from 'lodash.debounce'
import ServiceSpotCallout from '@/components/service-spots/ServiceSpotCallout'
import { isAxiosError } from 'axios'
import { mapUtil } from '@/utils/map'
import { googleApi } from '@/apis/google'
import { useDriveRequestContext } from '@/contexts/DriveRequestContext'

export default function MainLayout() {
  const { location, route, origin, setOrigin, destination, setRoute } =
    useDriveRequestContext()
  const map = useRef<MapView | null>(null)

  const [initialRegion, setInitialRegion] = useState<Region | null>(null)
  const [isRegionFirstChange, setIsRegionFirstChange] = useState(false)

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
    if (!origin || !destination?.place_id) return

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
        distanceMeters: data.routes[0].distanceMeters,
        polyline: data.routes[0].polyline
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
    googleApi.reverseGeocode(location.coords).then((detail) => {
      setOrigin({
        name: 'ตำแหน่งปัจจุบัน',
        geometry: detail.geometry,
        place_id: detail.place_id
      })
    })
  }, [location])

  return !initialRegion ? (
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
        showsUserLocation={!route}
      >
        {destination && (
          <Marker
            coordinate={{
              latitude: destination.geometry.location.lat,
              longitude: destination.geometry.location.lng
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
              latitude: origin.geometry.location.lat,
              longitude: origin.geometry.location.lng
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
