import { DriveRequest } from '@/sockets/drive-request/type'
import { commonUtil } from '@/utils/common'
import moment from 'moment'
import { Card, Colors, View, Text } from 'react-native-ui-lib'
import DriveRequestStatusChip from './DriveRequestStatusChip'
import { Fontisto } from '@expo/vector-icons'

export default function DriveRequestListItem({
  driveRequest,
  onPress
}: {
  driveRequest: DriveRequest
  onPress?: (driveRequest: DriveRequest) => void
}) {
  return (
    <Card row centerV padding-15 onPress={() => onPress?.(driveRequest)}>
      <View
        width={32}
        height={32}
        br100
        center
        backgroundColor={Colors.$backgroundPrimaryLight}
      >
        <Fontisto
          name="motorcycle"
          size={20}
          color={Colors.$backgroundPrimaryHeavy}
        />
      </View>

      <View flex-1 marginL-15 gap-5>
        <Text caption color={Colors.$textNeutralLight}>
          {moment(driveRequest.createdAt).format('DD/MM/YYYY HH:mm')}
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          color={Colors.$textNeutralHeavy}
        >
          {driveRequest.destination.name}
        </Text>
      </View>
      <View center gap-5>
        <DriveRequestStatusChip status={driveRequest.status} />
        <Text h4B>{commonUtil.formatCurrency(driveRequest.paidAmount)}</Text>
      </View>
    </Card>
  )
}
