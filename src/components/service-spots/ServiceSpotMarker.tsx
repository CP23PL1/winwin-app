import { ServiceSpot } from '@/apis/service-spots/type'
import { Callout, MapMarkerProps, Marker } from 'react-native-maps'
import { memo } from 'react'
import { router } from 'expo-router'
import ServiceSpotCallout from './ServiceSpotCallout'

type Props = MapMarkerProps & {
  data?: ServiceSpot
  visibility?: boolean
}

function ServiceSpotMarker({ data, visibility = true, ...props }: Props) {
  return (
    visibility && (
      <Marker
        {...props}
        icon={require('../../../assets/map_marker_orange.png')}
        tracksViewChanges={false}
      >
        {data && (
          <Callout
            onPress={() => router.navigate(`/service-spots/${data.id}`)}
            tooltip
          >
            <ServiceSpotCallout serviceSpot={data} />
          </Callout>
        )}
      </Marker>
    )
  )
}

export default memo(ServiceSpotMarker)
