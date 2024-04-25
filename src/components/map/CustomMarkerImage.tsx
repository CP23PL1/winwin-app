import { useMemo } from 'react'
import { Image } from 'react-native-ui-lib'

type CustomMarkerColor = 'blue' | 'red' | 'orange'
type Props = {
  color: CustomMarkerColor
  size?: number
}

export default function CustomMarkerImage({ color, size = 40 }: Props) {
  const colorAsset = useMemo(() => getMarkerAsset(color), [color])

  return (
    <Image
      style={{ width: size, height: size }}
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
