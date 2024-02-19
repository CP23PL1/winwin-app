import React from 'react'
import { Colors, Modal, View, ModalProps, Image } from 'react-native-ui-lib'
import { AntDesign } from '@expo/vector-icons'
import { Dimensions } from 'react-native'

type Props = ModalProps & {
  children: React.ReactNode
  width: number
}

export default function CardModal({ children, ...props }: Props) {
  const width = Dimensions.get('window').width
  const modalWidth = width - 50

  return (
    <Modal
      statusBarTranslucent
      transparent
      overlayBackgroundColor={Colors.rgba(0, 0, 0, 0.7)}
      {...props}
    >
      <View flex>
        <View height={'80%'} center paddingT-100>
          <View
            backgroundColor={Colors.$textPrimary}
            height={'100%'}
            width={modalWidth}
            br30
            flex
            centerV
          >
            {children}
          </View>
        </View>
        <View height={'20%'} center paddingB-60 width={width}>
          <View br100 backgroundColor={Colors.$textPrimary} padding-5>
            <AntDesign
              name="close"
              size={40}
              color={Colors.white}
              onPress={props.onRequestClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}
