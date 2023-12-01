import { ServiceSpotDto } from '@cp23pl1/winwin-client-sdk'
import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { Dimensions } from 'react-native'
import { View } from 'react-native-ui-lib'
import ServiceSpotListItem, {
  ServiceSpotListItemPressHandler
} from './ServiceSpotListItem'

type Props = {
  items?: ServiceSpotDto[]
  onItemPress?: ServiceSpotListItemPressHandler
}

function ServiceSpotList({ items, onItemPress }: Props) {
  if (!items) return null
  return (
    <View
      style={{
        height: Dimensions.get('screen').height
      }}
    >
      <FlashList
        data={items}
        renderItem={({ item }) => (
          <ServiceSpotListItem serviceSpot={item} onPress={onItemPress} />
        )}
        estimatedItemSize={100}
      />
    </View>
  )
}

export default ServiceSpotList
