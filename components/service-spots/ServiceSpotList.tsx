import { ServiceSpotDto } from '@cp23pl1/winwin-client-sdk'
import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { Dimensions } from 'react-native'
import { Text, View } from 'react-native-ui-lib'
import ServiceSpotListItem from './ServiceSpotListItem'

type Props = {
  items?: ServiceSpotDto[]
  radius: number
}

function ServiceSpotList({ items, radius }: Props) {
  if (!items) return null
  return (
    <View
      padding-15
      style={{
        height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width
      }}
    >
      <FlashList
        data={items}
        renderItem={({ item }) => <ServiceSpotListItem serviceSpot={item} />}
        estimatedItemSize={100}
      />
    </View>
  )
}

export default ServiceSpotList
