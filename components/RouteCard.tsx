import React, { useCallback, useState } from 'react'
import { View, Colors, Text, TouchableOpacity } from 'react-native-ui-lib'
import { FontAwesome5 } from '@expo/vector-icons'
import {
  GooglePlaceData,
  GooglePlaceDetail
} from 'react-native-google-places-autocomplete'
import { StyleSheet } from 'react-native'
import PlaceAutocompleteModal from './PlaceAutocompleteModal'

type Props = {
  origin: GooglePlaceDetail | null
  destination: GooglePlaceDetail | null
  onOriginChange: (origin: GooglePlaceDetail) => void
  onDestinationChange: (destination: GooglePlaceDetail) => void
}

export default function RouteCard({
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

  const handleWaypointPress = (waypoint: 'origin' | 'destination') => {
    setCurrentWaypoint(waypoint)
    setOpenPlaceAutocompleteModal(true)
  }
  const handlePlaceSelected = useCallback(
    (data: GooglePlaceData, detail: GooglePlaceDetail | null) => {
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
                {origin?.name || 'เลือกจุดรับ'}
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
