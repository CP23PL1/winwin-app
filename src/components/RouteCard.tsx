import React, { useCallback, useMemo, useState } from 'react'
import { View, Colors, Text, TouchableOpacity } from 'react-native-ui-lib'
import { FontAwesome5 } from '@expo/vector-icons'
import { GooglePlaceData } from 'react-native-google-places-autocomplete'
import { StyleSheet } from 'react-native'
import PlaceAutocompleteModal from './PlaceAutocompleteModal'
import { MaskedPlaceDetail } from '@/apis/google/type'
import { Waypoint } from '@/apis/drive-requests/types'
import { LocationObject } from 'expo-location'
import Toast from 'react-native-toast-message'

type Props = {
  currentLocation?: LocationObject | null
  origin: Waypoint | null
  destination: Waypoint | null
  onOriginChange: (origin: Waypoint) => void
  onDestinationChange: (destination: Waypoint) => void
}

export default function RouteCard({
  currentLocation,
  origin,
  destination,
  onOriginChange,
  onDestinationChange
}: Props) {
  const [currentWaypoint, setCurrentWaypoint] = useState<
    'origin' | 'destination'
  >()
  const [openPlaceAutocompleteModal, setOpenPlaceAutocompleteModal] =
    useState(false)

  const originName = useMemo(() => {
    if (origin) return origin.name
    if (currentLocation) return 'ตำแหน่งปัจจุบัน'
    return 'เลือกจุดรับ'
  }, [origin, currentLocation])

  const handleWaypointPress = (waypoint: 'origin' | 'destination') => {
    setCurrentWaypoint(waypoint)
    setOpenPlaceAutocompleteModal(true)
  }

  const handlePlaceSelected = useCallback(
    (data: GooglePlaceData, detail: MaskedPlaceDetail | null) => {
      setOpenPlaceAutocompleteModal(false)
      if (!detail) return

      if ([origin?.placeId, destination?.placeId].includes(detail.place_id)) {
        Toast.show({
          type: 'error',
          text1: 'เกิดข้อผิดพลาด',
          text2:
            'คุณไม่สามารถเลือกสถานที่เดิมซ้ำได้ กรุณาเลือกสถานที่ใหม่อีกครั้ง'
        })
        return
      }

      if (currentWaypoint === 'origin') {
        onOriginChange({
          name: data.description,
          location: detail.geometry.location,
          placeId: detail.place_id
        })
      } else {
        onDestinationChange({
          name: data.description,
          location: detail.geometry.location,
          placeId: detail.place_id
        })
      }
    },
    [origin, destination, currentWaypoint, onOriginChange, onDestinationChange]
  )

  return (
    <>
      <View
        bg-white
        br50
        padding-20
        gap-10
        width="90%"
        style={{ elevation: 2 }}
      >
        {destination && (
          <TouchableOpacity onPress={() => handleWaypointPress('origin')}>
            <View style={styles.row}>
              <FontAwesome5
                name="map-marker-alt"
                size={20}
                color={Colors.blue40}
              />
              <View
                style={{
                  width: 1,
                  backgroundColor: '#6a6a6a',
                  opacity: 0.2,
                  height: '100%'
                }}
              />
              <Text color={Colors.blue40} style={{ opacity: 0.6 }}>
                {originName}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => handleWaypointPress('destination')}>
          <View style={styles.row}>
            <FontAwesome5
              name="map-marker-alt"
              size={20}
              color={Colors.red40}
            />
            <View
              style={{
                width: 1,
                backgroundColor: '#6a6a6a',
                opacity: 0.2,
                height: '100%'
              }}
            />
            <Text color={Colors.$backgroundDark} style={{ opacity: 0.5 }}>
              {destination?.name || 'คุณต้องการไปที่ไหน?'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <PlaceAutocompleteModal
        location={currentLocation}
        visible={openPlaceAutocompleteModal}
        predefinedCurrentLocation={currentWaypoint === 'origin'}
        onRequestClose={() => setOpenPlaceAutocompleteModal(false)}
        onSelectPlace={handlePlaceSelected}
      />
    </>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    overflow: 'scroll'
  }
})
