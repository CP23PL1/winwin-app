import { Stack, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import MapView, {
  Callout,
  Details,
  Marker,
  PROVIDER_GOOGLE,
  Region
} from 'react-native-maps'
import {
  View,
  Text,
  Colors,
  TouchableOpacity,
  DynamicFonts
} from 'react-native-ui-lib'
import { useLocation } from '../../hooks/useLocation'
import { useQuery } from '@tanstack/react-query'
import { serviceSpotsApi } from '../../apis/service-spots'
import { NEARBY_RADIUS } from '../../constants/service-spots'
import { serviceSpotUtil } from '../../utils/service-spot'
import { MaterialIcons } from '@expo/vector-icons'
import { ServiceSpot } from '../../apis/service-spots/type'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

const LAT_DELTA = 0.01
const LNG_DELTA = 0.01

export default function ServiceSpotsMapScreen() {
  const router = useRouter()
  const mapRef = useRef<MapView>(null)
  const { location } = useLocation()
  const [region, setRegion] = useState<Region | undefined>()

  const { data: serviceSpots } = useQuery({
    queryKey: ['service-spots'],
    queryFn: () =>
      serviceSpotsApi.getNearbyServiceSpots({
        lat: region?.latitude,
        lng: region?.longitude,
        radius: NEARBY_RADIUS
      }),
    enabled: !!region
  })

  const handleRegionChangeComplete = useCallback(
    (region: Region, details: Details) => {
      if (!details.isGesture) return
      setRegion(region)
    },
    []
  )

  const handleMyLocationPress = useCallback(() => {
    if (!location) return
    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: LAT_DELTA,
      longitudeDelta: LNG_DELTA
    })
  }, [location])

  const handleCalloutPress = useCallback((serviceSpotId: ServiceSpot['id']) => {
    router.push(`/(protected)/service-spots/${serviceSpotId}`)
  }, [])

  useEffect(() => {
    if (!location) return
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: LAT_DELTA,
      longitudeDelta: LNG_DELTA
    })
  }, [location])

  return (
    region && (
      <View flex>
        <Stack.Screen options={{ title: 'แผนที่' }} />
        <MapView
          ref={mapRef}
          style={{ height: '105%' }}
          provider={PROVIDER_GOOGLE}
          region={region}
          showsUserLocation
          moveOnMarkerPress
          showsMyLocationButton={false}
          onRegionChangeComplete={handleRegionChangeComplete}
          toolbarEnabled={false}
        >
          {serviceSpots?.map((serviceSpot) => (
            <Marker
              key={serviceSpot.id}
              coordinate={{
                // @ts-ignore
                latitude: serviceSpot.coords.coordinates[1] || 0,
                // @ts-ignore
                longitude: serviceSpot.coords.coordinates[0] || 0
              }}
            >
              <Callout onPress={() => handleCalloutPress(serviceSpot.id)}>
                <View style={{ padding: 10 }}>
                  <Text>{serviceSpot.name}</Text>
                  <Text>
                    {serviceSpotUtil.getDistanceText(serviceSpot.distance!)}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
        <View absT absL padding-15 style={{ width: '100%' }}>
          <GooglePlacesAutocomplete
            placeholder="ค้นหาสถานที่"
            onFail={(error) => console.error(error)}
            onPress={(data, details = null) => {
              console.log(data, details)
            }}
            styles={{
              textInput: {
                fontFamily: 'NotoSansThai'
              },
              listView: {
                borderRadius: 10,
                backgroundColor: 'white'
              },
              row: {
                backgroundColor: 'transperent'
              },
              poweredContainer: {
                display: 'none'
              }
            }}
            query={{
              key: 'AIzaSyDMcuFdAqM9SvGP0D5ImQ7b8sZ0SDzFBJo',
              language: 'th',
              components: 'country:th'
            }}
            debounce={300}
          />
        </View>
        <TouchableOpacity
          br100
          bg-white
          padding-10
          style={{ position: 'absolute', bottom: 15, right: 15, elevation: 1 }}
          onPress={handleMyLocationPress}
        >
          <MaterialIcons name="my-location" size={24} color={Colors.blue50} />
        </TouchableOpacity>
        {/* <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
          <Text caption>ระยะ {NEARBY_RADIUS / 1000} กม.</Text>
        </View> */}
      </View>
    )
  )
}
