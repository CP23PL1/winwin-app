import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MapView, {
  Details,
  MapMarker,
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
  Region
} from 'react-native-maps'
import { Colors, LoaderScreen, View } from 'react-native-ui-lib'
import { Dimensions, Linking, Pressable, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { serviceSpotsApi } from '@/apis/service-spots'
import { MAX_DISTANCE_METERS, NEARBY_RADIUS } from '@/constants/service-spots'
import debounce from 'lodash.debounce'
import { isAxiosError } from 'axios'
import { mapUtil } from '@/utils/map'
import { useDriveRequestContext } from '@/contexts/DriveRequestContext'
import { driveRequestsApi } from '@/apis/drive-requests'
import { SafeAreaView } from 'react-native-safe-area-context'
import RouteCard from '@/components/RouteCard'
import { Waypoint } from '@/apis/drive-requests/types'
import DriveRequestPreviewSheet from '@/components/drive-requests/DriveRequestPreviewSheet'
import DriveRequestDetailSheet from '@/components/drive-requests/DriveRequestDetailSheet'
import { MaterialIcons } from '@expo/vector-icons'
import ServiceSpotMarker from '@/components/service-spots/ServiceSpotMarker'
import MapSettingMenu from '@/components/map/MapSettingMenu'

export default function MainScreen() {
  const {
    isRequesting,
    driveRequest,
    points,
    location,
    route,
    origin,
    destination,
    hasNewChatMessage,
    setHasNewChatMessage,
    requestDrive,
    setRoute,
    setOrigin,
    setDestination,
    reset
  } = useDriveRequestContext()
  const queryClient = useQueryClient()
  const map = useRef<MapView | null>(null)
  const originMarker = useRef<MapMarker | null>(null)
  const destinationMarker = useRef<MapMarker | null>(null)
  const [initialRegion, setInitialRegion] = useState<Region | null>(null)
  const [showServiceSpotMarkers, setShowServiceSpotMarkers] = useState(true)
  const { data: originServiceSpots } = useQuery({
    queryKey: ['origin-service-spots'],
    queryFn: () =>
      serviceSpotsApi.getNearbyServiceSpots({
        lat: origin?.location.lat,
        lng: origin?.location.lng,
        radius: NEARBY_RADIUS
      }),
    enabled: origin !== null
  })

  const { data: destinationServiceSpots } = useQuery({
    queryKey: ['destination-service-spots'],
    queryFn: () =>
      serviceSpotsApi.getNearbyServiceSpots({
        lat: destination?.location.lat,
        lng: destination?.location.lng,
        radius: NEARBY_RADIUS
      }),
    enabled: destination !== null
  })

  const serviceSpots = useMemo(() => {
    let _originServiceSpots = originServiceSpots || []
    let _destinationServiceSpots = destinationServiceSpots || []
    const merged = _originServiceSpots.concat(_destinationServiceSpots)
    return [...new Map(merged.map((item) => [item.id, item])).values()]
  }, [originServiceSpots, destinationServiceSpots])

  const handleRegionChangeComplete = useCallback(
    debounce((_, details: Details) => {
      if (details.isGesture) return
      queryClient.invalidateQueries({
        queryKey: ['origin-service-spots', 'destination-service-spots'],
        type: 'all'
      })
    }, 500),
    []
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
            top: 300,
            right: 100,
            bottom: 300,
            left: 100
          }
        })
        originMarker.current?.redraw()
        destinationMarker.current?.redraw()
      } catch (error) {
        if (isAxiosError(error)) {
          console.error(error.response?.data)
        }
      }
    },
    [map.current, originMarker.current, destinationMarker.current]
  )

  const handlePhonePressed = useCallback(() => {
    if (!driveRequest?.driver.phoneNumber) {
      throw new Error('Driver phone number is not available')
    }
    Linking.openURL(`tel:${driveRequest?.driver.phoneNumber}`)
  }, [driveRequest?.driver.phoneNumber])

  const handleChatBubblePressed = useCallback(() => {
    router.push('/drive-request/chat')
    setHasNewChatMessage(false)
  }, [])

  const handleDriveRequestPreviewCancel = useCallback(() => {
    reset()
    setShowServiceSpotMarkers(true)
  }, [])

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
      map.current?.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        },
        1000
      )
    }
  }, [map.current, location, initialRegion, origin])

  if (!initialRegion) return <LoaderScreen />

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 60 }}>
      <MapView
        ref={map}
        maxZoomLevel={16}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={!route}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        showsCompass={false}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {!driveRequest &&
          serviceSpots?.map((serviceSpot) => (
            <ServiceSpotMarker
              data={serviceSpot}
              identifier={serviceSpot.id.toString()}
              key={serviceSpot.id}
              onPress={() =>
                map.current?.fitToSuppliedMarkers([serviceSpot.id.toString()])
              }
              coordinate={{
                latitude: serviceSpot.coords.lat,
                longitude: serviceSpot.coords.lng
              }}
              visibility={showServiceSpotMarkers}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              zIndex={10}
            />
          ))}
        {destination && (
          <Marker
            zIndex={20}
            ref={destinationMarker}
            coordinate={{
              latitude: destination.location.lat,
              longitude: destination.location.lng
            }}
            tracksViewChanges={false}
            icon={require('../../../../../assets/map_marker_red.png')}
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
            zIndex={20}
            ref={originMarker}
            coordinate={{
              latitude: origin.location.lat,
              longitude: origin.location.lng
            }}
            tracksViewChanges={false}
            icon={require('../../../../../assets/map_marker_blue.png')}
          />
        )}
      </MapView>
      {!driveRequest && !route && (
        <Pressable
          style={styles.currentLocationButton}
          onPress={() => map.current?.animateToRegion(initialRegion, 1000)}
        >
          <MaterialIcons name="my-location" size={24} color={Colors.blue40} />
        </Pressable>
      )}
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
        <>
          <DriveRequestPreviewSheet
            route={route}
            requestDrive={requestDrive}
            isRequesting={isRequesting}
            maxDistanceMeters={MAX_DISTANCE_METERS}
            onCancel={handleDriveRequestPreviewCancel}
          />
          <MapSettingMenu
            style={styles.mapSettingMenu}
            onPressCurrentLocation={() =>
              map.current?.animateToRegion(initialRegion)
            }
            onToggleMapMarker={setShowServiceSpotMarkers}
          />
        </>
      )}
      {driveRequest && (
        <DriveRequestDetailSheet
          driveRequest={driveRequest}
          hasNewMessageReceived={hasNewChatMessage}
          onChatBubblePressed={handleChatBubblePressed}
          onPhonePressed={handlePhonePressed}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  currentLocationButton: {
    position: 'absolute',
    bottom: 40,
    right: 25,
    justifyContent: 'center',
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 10
  },
  mapSettingMenu: {
    position: 'absolute',
    top: Dimensions.get('screen').height / 3,
    right: 10
  }
})
