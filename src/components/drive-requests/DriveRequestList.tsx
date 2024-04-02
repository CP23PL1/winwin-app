import { DriveRequest } from '@/sockets/drive-request/type'
import { FlashList, FlashListProps } from '@shopify/flash-list'
import { View } from 'react-native-ui-lib'
import DriveRequestListItem from './DriveRequestListItem'

type Props = {
  readonly data: DriveRequest[]
  readonly listProps?: Partial<FlashListProps<DriveRequest>>
  readonly onEndReached?: () => void
  readonly onDriveRequestPress?: (driveRequest: DriveRequest) => void
}

export default function DriveRequestList({
  data,
  listProps,
  onEndReached,
  onDriveRequestPress
}: Props) {
  return (
    <FlashList
      {...listProps}
      data={data}
      scrollEnabled={true}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View height={10} />}
      estimatedItemSize={100}
      renderItem={({ item }) => (
        <DriveRequestListItem
          driveRequest={item}
          onPress={onDriveRequestPress}
        />
      )}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
    />
  )
}
