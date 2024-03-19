import { StyleSheet } from 'react-native'
import { Colors, Image, Text, View } from 'react-native-ui-lib'
import { useDriveRequestContext } from '@/contexts/DriveRequestContext'
import { Redirect } from 'expo-router'
import Waypoint from '@/components/Waypoint'
import { DriveRequestStatus } from '@/sockets/drive-request/type'

export default function DriveRequestScreen() {
  const { route, origin, destination, driveRequest } = useDriveRequestContext()

  if (!route || !origin || !destination) {
    return <Redirect href="/" />
  }

  return !driveRequest?.status ? (
    <View absB absL bg-white padding-25 gap-20 style={styles.footer}>
      <Text>รอการตอบรับจากคนขับรถ</Text>
    </View>
  ) : driveRequest?.status === DriveRequestStatus.ACCEPTED ? (
    <View absB absL bg-white padding-25 gap-20 style={styles.footer}>
      <View gap-10>
        <Waypoint
          placeDetail={origin}
          color={Colors.blue40}
          styles={{ placeNameStyle: { fontSize: 16 } }}
        />
        <Waypoint
          placeDetail={destination}
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
    </View>
  ) : driveRequest?.status === DriveRequestStatus.REJECTED ? (
    <View absB absL bg-white padding-25 gap-20 style={styles.footer}>
      <Text>คำขอถูกปฏิเสธ</Text>
    </View>
  ) : null
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  }
})
