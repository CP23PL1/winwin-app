import React from 'react'
import { Colors, Modal, View, ModalProps } from 'react-native-ui-lib'
import { AntDesign } from '@expo/vector-icons'
import ImageViewer, {
  ImageViewerPropsDefine
} from 'react-native-image-zoom-viewer'
import { Dimensions } from 'react-native'

type Props = ModalProps & {
  imageViewerProps: ImageViewerPropsDefine
}

export default function ImageViewerModal({
  imageViewerProps,
  ...props
}: Props) {
  const width = Dimensions.get('window').width
  return (
    <Modal statusBarTranslucent transparent {...props}>
      <ImageViewer
        backgroundColor={Colors.rgba(0, 0, 0, 0.7)}
        renderFooter={() => (
          <View centerH paddingB-60 width={width}>
            <View br100 backgroundColor={Colors.$textPrimary} padding-5>
              <AntDesign
                name="close"
                size={40}
                color={Colors.white}
                onPress={props.onRequestClose}
              />
            </View>
          </View>
        )}
        {...imageViewerProps}
      />
    </Modal>
  )
}
