import { useMemo } from 'react'
import { Image } from 'react-native-ui-lib'

type CustomMarkerColor = 'blue' | 'red' | 'orange'
type Props = {
  color: CustomMarkerColor
}

export default function CustomMarkerImage({ color }: Props) {
  const colorAsset = useMemo(() => getMarkerAsset(color), [color])

  return (
    <Image
      style={{ width: 40, height: 40 }}
      resizeMode="contain"
      source={colorAsset}
    />
  )
}

function getMarkerAsset(color: CustomMarkerColor) {
  switch (color) {
    case 'blue':
      return require('../../../assets/map_marker_blue.png')
    case 'red':
      return require('../../../assets/map_marker_red.png')
    case 'orange':
      return require('../../../assets/map_marker_orange.png')
  }
}
