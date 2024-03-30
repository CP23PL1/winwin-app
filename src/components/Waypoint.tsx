import { View, Text, TextProps } from 'react-native-ui-lib'
import { FontAwesome5 } from '@expo/vector-icons'
import { TextStyle, ViewStyle } from 'react-native'
import { Waypoint as TWaypoint } from '@/apis/drive-requests/types'

type Props = {
  placeDetail: TWaypoint
  color: string
  styles?: {
    row?: ViewStyle
    placeNameStyle?: TextStyle
  }
  textProps?: TextProps
  useDivider?: boolean
}

export default function Waypoint({
  placeDetail,
  color,
  styles,
  textProps,
  useDivider = true
}: Props) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          gap: 10
        },
        styles?.row
      ]}
    >
      <FontAwesome5 name="map-marker-alt" size={20} color={color} />
      {useDivider && (
        <View
          style={{
            width: 1,
            backgroundColor: '#6a6a6a',
            opacity: 0.2,
            height: '100%'
          }}
        />
      )}

      <View style={{ width: 0, flexGrow: 1, flex: 1 }}>
        <Text
          {...textProps}
          color={color}
          style={[{ flexShrink: 1 }, styles?.placeNameStyle]}
        >
          {placeDetail.name}
        </Text>
      </View>
    </View>
  )
}
