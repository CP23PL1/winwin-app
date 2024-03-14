import { View, Text, TouchableOpacity } from 'react-native-ui-lib'
import { FontAwesome5 } from '@expo/vector-icons'
import { MaskedPlaceDetail } from '../apis/google/type'
import { TextStyle, ViewStyle } from 'react-native'

type Props = {
  placeDetail: MaskedPlaceDetail
  color: string
  styles?: {
    row?: ViewStyle
    placeNameStyle?: TextStyle
  }
}

export default function Waypoint({ placeDetail, color, styles }: Props) {
  const handleWaypointPress = (waypoint: 'origin' | 'destination') => {}

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          overflow: 'scroll'
        },
        styles?.row
      ]}
    >
      <FontAwesome5 name="map-marker-alt" size={20} color={color} />
      <View
        style={{
          width: 1,
          backgroundColor: '#6a6a6a',
          opacity: 0.2,
          height: '100%'
        }}
      />
      <TouchableOpacity onPress={() => handleWaypointPress('origin')}>
        <Text color={color} style={[{ opacity: 0.6 }, styles?.placeNameStyle]}>
          {placeDetail.name}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
