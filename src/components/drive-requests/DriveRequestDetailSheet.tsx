import {
  DriveRequest,
  DriveRequestSessionStatus
} from '@/sockets/drive-request/type'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import moment from 'moment'
import React from 'react'
import { Colors, View, Text, Image } from 'react-native-ui-lib'
import Waypoint from '../Waypoint'
import { StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type Props = {
  driveRequest: DriveRequest
  hasNewMessageReceived: boolean
  onChatBubblePressed: () => void
}
export default function DriveRequestDetailSheet({
  driveRequest,
  hasNewMessageReceived,
  onChatBubblePressed
}: Props) {
  return (
    <BottomSheet snapPoints={['40%']}>
      <BottomSheetView>
        <View height={300} padding-25 gap-20 style={styles.footer}>
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
            />
            <Waypoint
              placeDetail={driveRequest.destination!}
              color={Colors.red40}
              styles={{ placeNameStyle: { fontSize: 16 } }}
            />
          </View>
          <View>
            <View row centerV spread>
              <Text bodyB>รหัสเรียกรถ</Text>
              <Text caption>{driveRequest?.id}</Text>
            </View>
            <View row centerV spread>
              <Text bodyB>วันที่</Text>
              <Text caption>
                {moment(driveRequest?.createdAt).format('DD/MM/YYYY HH:mm')}
              </Text>
            </View>
          </View>

          <View row spread centerV>
            <View row centerV gap-10>
              <Image
                src={driveRequest.driver.info.profileImage}
                alt=""
                style={{ width: 60, height: 60, borderRadius: 60 }}
              />
              <View>
                <Text bodyB>
                  {driveRequest.driver.info.firstName}{' '}
                  {driveRequest.driver.info.lastName}
                </Text>
                <Text caption>วินหลายเลข {driveRequest.driver.info.no}</Text>
              </View>
            </View>
            <View>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={32}
                onPress={onChatBubblePressed}
              />
              {hasNewMessageReceived && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: 'red',
                    width: 10,
                    height: 10,
                    borderRadius: 5
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  }
})
