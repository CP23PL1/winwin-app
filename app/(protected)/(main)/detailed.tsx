import React, { useEffect, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { Button, Text, View } from 'react-native-ui-lib'
import { commonUtil } from '../../../utils/common'
import { serviceSpotUtil } from '../../../utils/service-spot'
import { SERVICE_CHARGE } from '../../../constants/service-spots'
import { useDriveRequestContext } from '../../../contexts/DriveRequestContext'
import { socketManager } from '../../../libs/socket-client'
import auth0 from '../../../libs/auth0'

const driveRequestsSocket = socketManager.socket('/drive-requests', {
  auth: async (cb) => {
    const credentials = await auth0.credentialsManager.getCredentials()
    cb({
      token: credentials.accessToken
    })
  }
})

export default function DetailedScreen() {
  const { route } = useDriveRequestContext()

  const price = useMemo(
    () =>
      route?.distanceMeters
        ? serviceSpotUtil.calculatePrice(route.distanceMeters / 1000)
        : 0,
    [route?.distanceMeters]
  )

  const createDriveRequest = () => {
    if (driveRequestsSocket.disconnected) {
      driveRequestsSocket.connect()
    }
    driveRequestsSocket.emit('drive-requests:create', 'hello')
  }

  useEffect(() => {
    return () => {
      if (driveRequestsSocket.connected) {
        driveRequestsSocket.disconnect()
      }
    }
  }, [])

  if (!route) return null

  return (
    <View absB absL bg-white padding-15 style={styles.footer}>
      <View paddingH-15 marginB-15>
        <View row spread centerV>
          <Text caption>ระยะทางและเวลา</Text>
          <Text h5B>
            {Math.round(parseInt(route.duration.split('s')[0]) / 60)} นาที (
            {serviceSpotUtil.getDistanceText(route.distanceMeters)})
          </Text>
        </View>
        <View row spread centerV>
          <Text caption>ค่าโดยสาร (ตามอัตรา)</Text>
          <Text body>{commonUtil.formatCurrency(price)}</Text>
        </View>
        <View row spread centerV>
          <Text caption>ค่าเรียก</Text>
          <Text body>{commonUtil.formatCurrency(SERVICE_CHARGE)}</Text>
        </View>
        <View row spread centerV>
          <Text caption>ทั้งหมด</Text>
          <Text h5B>{commonUtil.formatCurrency(price + SERVICE_CHARGE)}</Text>
        </View>
        <Button
          label="เรียกรับบริการ"
          disabled={!route}
          onPress={createDriveRequest}
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
