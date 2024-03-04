import React, { useCallback, useMemo, useState } from 'react'
import { View, Colors, Text, TouchableOpacity } from 'react-native-ui-lib'
import { FontAwesome5 } from '@expo/vector-icons'
import { GooglePlaceData } from 'react-native-google-places-autocomplete'
import { StyleSheet } from 'react-native'
import PlaceAutocompleteModal from './PlaceAutocompleteModal'
import { GeoPosition } from 'react-native-geolocation-service'
import { MaskedPlaceDetail } from '../apis/google/type'

type Props = {
  currentLocation?: GeoPosition | null
  origin: MaskedPlaceDetail | null
  destination: MaskedPlaceDetail | null
  onOriginChange: (origin: MaskedPlaceDetail) => void
  onDestinationChange: (destination: MaskedPlaceDetail) => void
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
  >('origin')
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
      if (currentWaypoint === 'origin') {
        onOriginChange(detail)
      } else {
        onDestinationChange(detail)
      }
    },
    [currentWaypoint, onOriginChange, onDestinationChange]
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
            <TouchableOpacity onPress={() => handleWaypointPress('origin')}>
              <Text color={Colors.blue40} style={{ opacity: 0.6 }}>
                {originName}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.row}>
          <FontAwesome5 name="map-marker-alt" size={20} color={Colors.red40} />
          <View
            style={{
              width: 1,
              backgroundColor: '#6a6a6a',
              opacity: 0.2,
              height: '100%'
            }}
          />
          <TouchableOpacity onPress={() => handleWaypointPress('destination')}>
            <Text color={Colors.$backgroundDark} style={{ opacity: 0.5 }}>
              {destination?.name || 'คุณต้องการไปที่ไหน?'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <PlaceAutocompleteModal
        location={currentLocation}
        visible={openPlaceAutocompleteModal}
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
