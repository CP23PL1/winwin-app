import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import {
  GooglePlaceData,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef
} from 'react-native-google-places-autocomplete'
import { Colors, Modal, ModalProps, Text, View } from 'react-native-ui-lib'
import { FontAwesome5, Feather, MaterialIcons } from '@expo/vector-icons'
import uuid from 'react-native-uuid'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaskedPlaceDetail } from '@/apis/google/type'
import { MAX_DISTANCE_METERS } from '@/constants/service-spots'
import { LocationObject } from 'expo-location'

type Props = ModalProps & {
  location?: LocationObject | null
  fields?: string
  predefinedCurrentLocation?: boolean
  onSelectPlace: (
    data: GooglePlaceData,
    detail: MaskedPlaceDetail | null
  ) => void
}

export default function PlaceAutocompleteModal({
  location,
  predefinedCurrentLocation,
  onSelectPlace,
  fields = 'geometry,name,place_id',
  ...props
}: Props) {
  const [autocompleteSessionToken, setAutocompleteSessionToken] =
    useState<string>(uuid.v4().toString())
  const [predefinedPlaces, setPredefinedPlaces] = useState<any>([])

  const handleSelectPlace = useCallback(
    (data: GooglePlaceData, detail: MaskedPlaceDetail | null) => {
      onSelectPlace(data, detail)
      setAutocompleteSessionToken(uuid.v4().toString())
    },
    [onSelectPlace]
  )

  const ref = useRef<GooglePlacesAutocompleteRef | null>(null)

  useEffect(() => {
    if (!ref.current) return
    if (!props.visible) return
    const timeout = setTimeout(() => {
      ref.current?.focus()
    }, 100)
    return () => clearTimeout(timeout)
  }, [ref.current, props.visible])

  useEffect(() => {
    if (!location || !predefinedCurrentLocation) return
    setPredefinedPlaces([
      {
        structured_formatting: {
          main_text: 'ตำแหน่งปัจจุบัน',
          secondary_text: 'เลือกตำแหน่งปัจจุบัน'
        },
        description: 'ตำแหน่งปัจจุบัน',
        icon: (
          <MaterialIcons name="my-location" size={20} color={Colors.blue40} />
        ),
        geometry: {
          location: {
            lat: location.coords.latitude,
            lng: location.coords.longitude
          }
        }
      }
    ])

    return () => {
      setPredefinedPlaces([])
    }
  }, [location, predefinedCurrentLocation])

  return (
    <Modal {...props} animationType="slide" statusBarTranslucent>
      <SafeAreaView style={{ height: '100%' }}>
        <GooglePlacesAutocomplete
          ref={ref}
          enablePoweredByContainer={false}
          placeholder="ค้นหาสถานที่"
          onPress={handleSelectPlace}
          styles={{
            container: styles.container,
            textInputContainer: styles.textInputContainer,
            textInput: styles.textInput
          }}
          fetchDetails
          renderLeftButton={() => <Feather name="search" size={20} />}
          predefinedPlaces={predefinedPlaces}
          predefinedPlacesAlwaysVisible
          renderRow={(data: any) => (
            <View row gap-12>
              {data.icon ? (
                data.icon
              ) : (
                <FontAwesome5
                  name="map-marker-alt"
                  size={20}
                  color={Colors.red40}
                />
              )}

              <View>
                <Text>{data.structured_formatting.main_text}</Text>
                <Text style={{ fontSize: 12 }}>
                  {data.structured_formatting.secondary_text}
                </Text>
              </View>
            </View>
          )}
          GooglePlacesDetailsQuery={{
            fields,
            sessiontoken: autocompleteSessionToken
          }}
          query={{
            key: 'AIzaSyDMcuFdAqM9SvGP0D5ImQ7b8sZ0SDzFBJo',
            language: 'th',
            components: 'country:th',
            strictbounds: true,
            location: location
              ? `${location.coords.latitude},${location.coords.longitude}`
              : undefined,
            radius: MAX_DISTANCE_METERS,
            sessiontoken: autocompleteSessionToken
          }}
          onFail={(error) => console.error(error)}
        />
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 15,
    paddingTop: 10
  },
  textInputContainer: {
    alignItems: 'center',
    gap: 5
  },
  textInput: {
    fontFamily: 'NotoSansThai',
    borderBottomColor: Colors.rgba(0, 0, 0, 0.1),
    borderBottomWidth: 1
  }
})
