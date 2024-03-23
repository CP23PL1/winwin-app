import { ActivityIndicator, StyleSheet } from 'react-native'
import { Colors, Image, Text, View } from 'react-native-ui-lib'
import { useDriveRequestContext } from '@/contexts/DriveRequestContext'
import { Redirect, Stack, router } from 'expo-router'
import Waypoint from '@/components/Waypoint'
import { DriveRequestStatus } from '@/sockets/drive-request/type'
import { Ionicons } from '@expo/vector-icons'

export default function DriveRequestScreen() {
  const { isRequesting, origin, destination, driveRequest } =
    useDriveRequestContext()

  if (isRequesting) {
    return (
      <View absB absL bg-white padding-25 gap-20 style={styles.footer}>
        <ActivityIndicator
          size="large"
          color={Colors.$backgroundPrimaryHeavy}
        />
        <Text center>โปรดรอสักครู่ เรากำลังหาคนขับให้คุณ...</Text>
      </View>
    )
  }

  if (!driveRequest) {
    return <Redirect href="/" />
  }

  return (
    <View absB absL bg-white padding-25 gap-20 style={styles.footer}>
      <View>
        {driveRequest.status === DriveRequestStatus.ACCEPTED ? (
          <Text h4B>คนขับกำลังมารับคุณ</Text>
        ) : driveRequest.status === DriveRequestStatus.PICKED_UP ? (
          <Text h4B>คุณกำลังเดินทางไปยังที่หมาย</Text>
        ) : (
          <></>
        )}
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
          <Text caption>{driveRequest?.refCode}</Text>
        </View>
        <View row centerV spread>
          <Text bodyB>วันที่</Text>
          <Text caption>{driveRequest?.createdAt}</Text>
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
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={32}
          onPress={() => router.push('/drive-request/chat')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  }
})
