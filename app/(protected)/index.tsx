import React, { useCallback, useEffect, useRef, useState } from 'react'
import MapView, {
  Callout,
  Details,
  Marker,
  PROVIDER_GOOGLE,
  Region
} from 'react-native-maps'
import { LoaderScreen, View, Button } from 'react-native-ui-lib'
import { useLocation } from '../../hooks/useLocation'
import { StyleSheet } from 'react-native'
import { Stack, router } from 'expo-router'
import AddressSearchInput from '../../components/AddressSearchInput'
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete
} from 'react-native-google-places-autocomplete'
import { useQuery } from '@tanstack/react-query'
import { serviceSpotsApi } from '../../apis/service-spots'
import { NEARBY_RADIUS } from '../../constants/service-spots'
import debounce from 'lodash.debounce'
import ServiceSpotCallout from '../../components/service-spots/ServiceSpotCallout'
import uuid from 'react-native-uuid'

const initialRegionDelta = {
  latitudeDelta: 0.01,
  longitudeDelta: 0.01
}

export default function RootProtectedScreen({}) {
  const { location } = useLocation()
  const map = useRef<MapView | null>(null)
  const [autocompleteSessionToken, setAutocompleteSessionToken] =
    useState<string>(uuid.v4().toString())
  const [initialRegion, setInitialRegion] = useState<Region | null>(null)
  const [isRegionFirstChange, setIsRegionFirstChange] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<Pick<
    GooglePlaceDetail,
    'geometry'
  > | null>(null)

  const { data: serviceSpots, refetch: refetchNearbyServiceSpots } = useQuery({
    queryKey: ['service-spots'],
    queryFn: () =>
      serviceSpotsApi.getNearbyServiceSpots({
        lat: selectedPlace?.geometry.location.lat,
        lng: selectedPlace?.geometry.location.lng,
        radius: NEARBY_RADIUS
      }),
    enabled: selectedPlace !== null
  })

  useEffect(() => {
    if (!location) return
    setInitialRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      ...initialRegionDelta
    })
  }, [location])

  const handlePlaceSelect = useCallback(
    (_: GooglePlaceData, details: GooglePlaceDetail | null) => {
      if (!details) return
      map.current?.animateToRegion({
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        ...initialRegionDelta
      })
      setSelectedPlace(details)
      setAutocompleteSessionToken(uuid.v4().toString())
    },
    [map.current]
  )
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

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {initialRegion ? (
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
            {selectedPlace && (
              <Marker
                coordinate={{
                  latitude: selectedPlace.geometry.location.lat,
                  longitude: selectedPlace.geometry.location.lng
                }}
                image={require('../../assets/map_marker_red.png')}
              />
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
          <View marginT-30 padding-20 center height="100%">
            <GooglePlacesAutocomplete
              enablePoweredByContainer={false}
              placeholder="ค้นหาสถานที่"
              onPress={handlePlaceSelect}
              styles={{ container: styles.placeAutocompleteContainer }}
              fetchDetails
              GooglePlacesDetailsQuery={{
                fields: 'geometry',
                sessiontoken: autocompleteSessionToken
              }}
              query={{
                key: 'AIzaSyDMcuFdAqM9SvGP0D5ImQ7b8sZ0SDzFBJo',
                language: 'th',
                components: 'country:th',
                sessiontoken: autocompleteSessionToken
              }}
              textInputProps={{
                InputComp: AddressSearchInput,
                style: { padding: 0 }
              }}
              onFail={(error) => console.error(error)}
            />
          </View>
          <View absB absL bg-white padding-15 style={styles.footer}>
            <Button label="เรียกรับบริการ" disabled={selectedPlace === null} />
          </View>
        </View>
      ) : (
        <LoaderScreen />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  placeAutocompleteContainer: {
    width: '100%'
  }
})
