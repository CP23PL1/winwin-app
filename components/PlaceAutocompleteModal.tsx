import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef
} from 'react-native-google-places-autocomplete'
import { Colors, Modal, ModalProps, View, Text } from 'react-native-ui-lib'
import { FontAwesome5, Feather } from '@expo/vector-icons'
import uuid from 'react-native-uuid'

type Props = ModalProps & {
  onSelectPlace: (
    data: GooglePlaceData,
    detail: GooglePlaceDetail | null
  ) => void
}

export default function PlaceAutocompleteModal(props: Props) {
  const [autocompleteSessionToken, setAutocompleteSessionToken] =
    useState<string>(uuid.v4().toString())

  const handleSelectPlace = useCallback(
    (data: GooglePlaceData, detail: GooglePlaceDetail | null) => {
      props.onSelectPlace(data, detail)
      setAutocompleteSessionToken(uuid.v4().toString())
    },
    [props.onSelectPlace]
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

  return (
    <Modal {...props} animationType="slide">
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
        renderRow={(data) => (
          <View row gap-12>
            <FontAwesome5
              name="map-marker-alt"
              size={20}
              color={Colors.red40}
            />
            <View>
              <Text>{data.structured_formatting.main_text}</Text>
              <Text style={{ fontSize: 12 }}>
                {data.structured_formatting.secondary_text}
              </Text>
            </View>
          </View>
        )}
        GooglePlacesDetailsQuery={{
          fields: 'geometry,name,place_id',
          sessiontoken: autocompleteSessionToken
        }}
        query={{
          key: 'AIzaSyDMcuFdAqM9SvGP0D5ImQ7b8sZ0SDzFBJo',
          language: 'th',
          components: 'country:th',
          sessiontoken: autocompleteSessionToken
        }}
        onFail={(error) => console.error(error)}
      />
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15
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
