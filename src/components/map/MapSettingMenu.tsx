import React, { useCallback, useState } from 'react'
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { Colors, Text, View } from 'react-native-ui-lib'
import { MaterialCommunityIcons } from '@expo/vector-icons'

type Props = {
  style?: StyleProp<ViewStyle>
  onToggleMapMarker: (state: boolean) => void
  onPressCurrentLocation: () => void
}

export default function MapSettingMenu({
  style,
  onToggleMapMarker,
  onPressCurrentLocation
}: Props) {
  const [isMapMarkerVisible, setIsMapMarkerVisible] = useState(true)

  const handleToggleMapMarker = useCallback(() => {
    setIsMapMarkerVisible(!isMapMarkerVisible)
    onToggleMapMarker(!isMapMarkerVisible)
  }, [isMapMarkerVisible, onToggleMapMarker])

  return (
    <View style={[style, styles.container]}>
      <Pressable onPress={handleToggleMapMarker}>
        <MaterialCommunityIcons
          name={
            isMapMarkerVisible ? 'map-marker-off' : 'map-marker-radius-outline'
          }
          size={24}
          color={isMapMarkerVisible ? Colors.$iconDanger : Colors.blue40}
        />
      </Pressable>
      <View
        style={{ width: '100%', height: 1, backgroundColor: Colors.grey50 }}
      />
      <Pressable onPress={onPressCurrentLocation}>
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={24}
          color={Colors.blue40}
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 10,
    gap: 10
  }
})
