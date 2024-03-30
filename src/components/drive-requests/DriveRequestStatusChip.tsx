import { driveRequestStatusText } from '@/constants/drive-request'
import {
  DriveRequestSessionStatus,
  DriveRequestStatus
} from '@/sockets/drive-request/type'
import { View, Text, Colors } from 'react-native-ui-lib'

const getBadgeStyle = (
  status: DriveRequestSessionStatus | DriveRequestStatus
) => {
  switch (status) {
    case DriveRequestSessionStatus.COMPLETED:
      return {
        backgroundColor: Colors.$backgroundSuccessLight,
        color: Colors.$textSuccess
      }
    case DriveRequestSessionStatus.CANCELLED:
      return {
        backgroundColor: Colors.$backgroundDangerLight,
        color: Colors.$textDanger
      }
    case DriveRequestSessionStatus.ARRIVED:
      return {
        backgroundColor: Colors.$backgroundWarningLight,
        color: Colors.$textWarning
      }
    case DriveRequestSessionStatus.PICKED_UP:
    case DriveRequestSessionStatus.ON_GOING:
      return {
        backgroundColor: Colors.$backgroundPrimaryLight,
        color: Colors.$textPrimary
      }
    default:
      return {}
  }
}

type Props = {
  status: DriveRequestSessionStatus | DriveRequestStatus
}

export default function DriveRequestStatusChip({ status }: Props) {
  const badgeStyles = getBadgeStyle(status)

  return (
    <View
      paddingH-10
      paddingV-5
      style={{ borderRadius: 100 }}
      backgroundColor={badgeStyles?.backgroundColor}
    >
      <Text style={{ fontSize: 12 }} color={badgeStyles?.color}>
        {driveRequestStatusText[status]}
      </Text>
    </View>
  )
}
