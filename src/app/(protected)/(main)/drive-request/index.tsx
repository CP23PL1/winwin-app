import { StyleSheet } from 'react-native'
import { Colors, Image, Text, View } from 'react-native-ui-lib'
import { useDriveRequestContext } from '@/contexts/DriveRequestContext'
import { Redirect, Stack, router } from 'expo-router'
import Waypoint from '@/components/Waypoint'
import { DriveRequestSessionStatus } from '@/sockets/drive-request/type'
import { Ionicons } from '@expo/vector-icons'
import { useCallback, useEffect, useState } from 'react'
import { driveRequestSocket } from '@/sockets/drive-request'
import moment from 'moment'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'

export default function DriveRequestScreen() {
  const { origin, destination, driveRequest } = useDriveRequestContext()

  const [newMessageReceived, setNewMessageReceived] = useState(false)

  const handleChatMessageReceived = () => {
    setNewMessageReceived(true)
  }

  const handleChatBubblePressed = useCallback(() => {
    if (newMessageReceived) {
      setNewMessageReceived(false)
    }
    router.push('/drive-request/chat')
  }, [newMessageReceived])

  useEffect(() => {
    driveRequestSocket.on('chat-message-received', handleChatMessageReceived)

    return () => {
      driveRequestSocket.off('chat-message-received', handleChatMessageReceived)
    }
  }, [])

  if (!driveRequest) {
    return <Redirect href="/" />
  }

  return (
    <>
      <Stack.Screen options={{ presentation: 'transparentModal' }} />
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
                placeDetail={origin!}
                color={Colors.blue40}
                styles={{ placeNameStyle: { fontSize: 16 } }}
              />
              <Waypoint
                placeDetail={destination!}
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
                  onPress={handleChatBubblePressed}
                />
                {newMessageReceived && (
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
    </>
  )
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  }
})
