import {
  DriveRequest,
  DriveRequestSessionStatus
} from '@/sockets/drive-request/type'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import moment from 'moment'
import React from 'react'
import { Colors, View, Text, Avatar } from 'react-native-ui-lib'
import Waypoint from '../Waypoint'
import { StyleSheet } from 'react-native'
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons'
import { commonUtil } from '@/utils/common'

type Props = {
  driveRequest: DriveRequest
  hasNewMessageReceived: boolean
  onChatBubblePressed: () => void
  onPhonePressed: () => void
}
export default function DriveRequestDetailSheet({
  driveRequest,
  hasNewMessageReceived,
  onChatBubblePressed,
  onPhonePressed
}: Props) {
  return (
    <BottomSheet snapPoints={['40%', '70%']}>
      <BottomSheetScrollView>
        <View padding-25 gap-20 style={styles.footer}>
          <View>
            <Text h4B>
              {driveRequest.status === DriveRequestSessionStatus.ON_GOING &&
                'คนขับกำลังมารับคุณ'}
              {driveRequest.status === DriveRequestSessionStatus.ARRIVED &&
                'คนขับถึงจุดรับแล้ว'}
              {driveRequest.status === DriveRequestSessionStatus.PICKED_UP &&
                'คุณกำลังเดินทางไปยังที่หมาย'}
            </Text>
          </View>
          <View gap-10>
            <Waypoint
              placeDetail={driveRequest.origin!}
              color={Colors.blue40}
              styles={{ placeNameStyle: { fontSize: 16 } }}
              useDivider={false}
            />
            <Waypoint
              placeDetail={driveRequest.destination!}
              color={Colors.red40}
              styles={{ placeNameStyle: { fontSize: 16 } }}
              useDivider={false}
            />
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: Colors.grey60
            }}
          />
          <View gap-5>
            <View row centerV spread>
              <Text caption>รหัสเรียกรถ</Text>
              <Text caption>{driveRequest?.id}</Text>
            </View>
            <View row centerV spread>
              <Text caption>วันที่</Text>
              <Text caption>
                {moment(driveRequest?.createdAt).format('DD/MM/YYYY HH:mm')}
              </Text>
            </View>
            <View row centerV spread>
              <Text caption>ค่าโดยสารตามอัตรา</Text>
              <Text caption>
                {commonUtil.formatCurrency(driveRequest.priceByDistance)}
              </Text>
            </View>
            <View row centerV spread>
              <Text caption>ค่าบริการ</Text>
              <Text caption>
                {commonUtil.formatCurrency(driveRequest.serviceCharge)}
              </Text>
            </View>
            <View row centerV spread>
              <Text bodyB>ทั้งหมด</Text>
              <Text bodyB>{commonUtil.formatCurrency(driveRequest.total)}</Text>
            </View>
          </View>

          <View row spread centerV>
            <View row centerV gap-10>
              <Avatar source={{ uri: driveRequest.driver.info.profileImage }} />
              <View>
                <Text bodyB>
                  {driveRequest.driver.info.firstName}{' '}
                  {driveRequest.driver.info.lastName}
                </Text>
                <Text caption>วินหมายเลข {driveRequest.driver.info.no}</Text>
              </View>
            </View>
            <View row center gap-15>
              <SimpleLineIcons
                name="phone"
                size={24}
                onPress={onPhonePressed}
              />
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                onPress={onChatBubblePressed}
              />
              {hasNewMessageReceived && <View style={styles.newMessageDot} />}
            </View>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  newMessageDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    width: 10,
    height: 10,
    borderRadius: 5
  }
})
