import React, { useCallback, useEffect, useRef, useState } from 'react'
import MapView, {
  Callout,
  Details,
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
  Region
} from 'react-native-maps'
import { LoaderScreen, View } from 'react-native-ui-lib'
import { StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { serviceSpotsApi } from '@/apis/service-spots'
import { NEARBY_RADIUS } from '@/constants/service-spots'
import debounce from 'lodash.debounce'
import ServiceSpotCallout from '@/components/service-spots/ServiceSpotCallout'
import { isAxiosError } from 'axios'
import { mapUtil } from '@/utils/map'
import { useDriveRequestContext } from '@/contexts/DriveRequestContext'
import { driveRequestsApi } from '@/apis/drive-requests'
import { SafeAreaView } from 'react-native-safe-area-context'
import RouteCard from '@/components/RouteCard'
import { Waypoint } from '@/apis/drive-requests/types'
import DriveRequestPreviewSheet from '@/components/drive-requests/DriveRequestPreviewSheet'
import DriveRequestDetailSheet from '@/components/drive-requests/DriveRequestDetailSheet'
import CustomMarkerImage from '@/components/map/CustomMarkerImage'

export default function MainScreen() {
  const {
    isRequesting,
    requestDrive,
    driveRequest,
    points,
    location,
    route,
    origin,
    destination,
    setRoute,
    setOrigin,
    setDestination
  } = useDriveRequestContext()
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

  const fetchRoutes = useCallback(
    async (origin: Waypoint, destination: Waypoint) => {
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
            top: 200,
            right: 100,
            bottom: 200,
            left: 100
          }
        })
        console.log('Fetch routes success')
      } catch (error) {
        if (isAxiosError(error)) {
          console.error(error.response?.data)
        }
      }
    },
    [map.current]
  )

  useEffect(() => {
    if (!origin || !destination) return
    fetchRoutes(origin, destination)
  }, [origin, destination, fetchRoutes])

  useEffect(() => {
    if (!location) return
    if (!initialRegion) {
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      })
    }
    if (!origin) {
      setOrigin({
        name: 'ตำแหน่งปัจจุบัน',
        location: {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        }
      })
    }
  }, [location, initialRegion, origin])

  return !initialRegion ? (
    <LoaderScreen />
  ) : (
    <SafeAreaView style={{ flex: 1, paddingTop: 60 }}>
      <MapView
        ref={map}
        maxZoomLevel={16}
        paddingAdjustmentBehavior="automatic"
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        onRegionChangeComplete={handleRegionChangeComplete}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton={false}
        showsUserLocation={!route}
        toolbarEnabled={false}
        showsCompass={false}
      >
        {destination && (
          <Marker
            coordinate={{
              latitude: destination.location.lat,
              longitude: destination.location.lng
            }}
          >
            <CustomMarkerImage color="red" />
          </Marker>
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
          >
            <CustomMarkerImage color="blue" />
          </Marker>
        )}
        {serviceSpots?.map((serviceSpot) => (
          <Marker
            onPress={() => map.current?.fitToElements()}
            key={serviceSpot.id}
            coordinate={{
              latitude: serviceSpot.coords.lat,
              longitude: serviceSpot.coords.lng
            }}
          >
            <CustomMarkerImage color="orange" />
            <Callout
              tooltip
              onPress={() => router.push(`/service-spots/${serviceSpot.id}`)}
            >
              <ServiceSpotCallout serviceSpot={serviceSpot} />
            </Callout>
          </Marker>
        ))}
      </MapView>

      {!driveRequest && (
        <View center>
          <RouteCard
            currentLocation={location}
            origin={origin}
            destination={destination}
            onOriginChange={setOrigin}
            onDestinationChange={setDestination}
          />
        </View>
      )}
      {route && !driveRequest && (
        <DriveRequestPreviewSheet
          route={route}
          requestDrive={requestDrive}
          isRequesting={isRequesting}
        />
      )}
      {driveRequest && (
        <DriveRequestDetailSheet
          driveRequest={driveRequest}
          hasNewMessageReceived={false}
          onChatBubblePressed={() => router.push('/drive-request/chat')}
        />
      )}
    </SafeAreaView>
  )
}
