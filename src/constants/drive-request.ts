import {
  DriveRequestSessionStatus,
  DriveRequestStatus
} from '@/sockets/drive-request/type'

export const driveRequestStatusText: Record<
  DriveRequestSessionStatus | DriveRequestStatus,
  string
> = {
  [DriveRequestSessionStatus.ARRIVED]: 'คนขับถึงจุดรับแล้ว',
  [DriveRequestSessionStatus.CANCELLED]: 'ยกเลิก',
  [DriveRequestSessionStatus.COMPLETED]: 'เสร็จสิ้น',
  [DriveRequestSessionStatus.ON_GOING]: 'คนขับกำลังเดินทางมาหาคุณ',
  [DriveRequestSessionStatus.PENDING]: 'รอการตอบรับ',
  [DriveRequestSessionStatus.PICKED_UP]: 'ขึ้นรถแล้ว'
}
