import { Colors, View } from 'react-native-ui-lib'
import { FontAwesome5 } from '@expo/vector-icons'
import { TextInput, TextInputProps } from 'react-native'
import React from 'react'

type Props = TextInputProps

const AddressSearchInput = React.forwardRef<TextInput, Props>((props, ref) => (
  <View
    bg-white
    row
    centerV
    gap-10
    padding-10
    br50
    style={{ elevation: 2, height: 60, width: '100%' }}
  >
    <View paddingH-5>
      <FontAwesome5 name="map-marker-alt" size={20} color={Colors.red40} />
    </View>
    <View
      style={{
        width: 1,
        backgroundColor: '#6a6a6a',
        opacity: 0.2,
        height: '100%'
      }}
    />
    <TextInput
      {...props}
      ref={ref}
      style={[
        props.style,
        {
          flex: 1,
          opacity: 0.5,
          color: Colors.$backgroundDark,
          fontFamily: 'NotoSansThai',
          fontSize: 16
        }
      ]}
    />
  </View>
))

export default AddressSearchInput
