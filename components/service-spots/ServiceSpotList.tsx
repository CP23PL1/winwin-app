import { ServiceSpotDto } from '@cp23pl1/winwin-client-sdk'
import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { Dimensions } from 'react-native'
import { View } from 'react-native-ui-lib'
import ServiceSpotListItem from './ServiceSpotListItem'

type Props = {
  items?: ServiceSpotDto[]
}

function ServiceSpotList({ items }: Props) {
  if (!items) return null
  return (
    <View
      style={{
        height: Dimensions.get('screen').height
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
