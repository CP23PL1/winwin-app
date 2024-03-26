import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Card, Text, View } from 'react-native-ui-lib'
import { commonUtil } from '@/utils/common'
import { serviceSpotUtil } from '@/utils/service-spot'
import { SERVICE_CHARGE } from '@/constants/service-spots'
import { useDriveRequestContext } from '@/contexts/DriveRequestContext'
import RouteCard from '@/components/RouteCard'

export default function MainScreen() {
  const {
    location,
    route,
    price,
    origin,
    setOrigin,
    destination,
    setDestination,
    driveRequest,
    requestDrive
  } = useDriveRequestContext()

  return !route ? (
    <SafeAreaView style={{ flex: 1, marginTop: 10, alignItems: 'center' }}>
      <RouteCard
        currentLocation={location}
        origin={origin}
        destination={destination}
        onOriginChange={setOrigin}
        onDestinationChange={setDestination}
      />
      {driveRequest && (
        <View absB absL center padding-20>
          <Card>
            <Text>HELLO</Text>
          </Card>
        </View>
      )}
    </SafeAreaView>
  ) : (
    <View
      absB
      absL
      bg-white
      padding-15
      gap-15
      width="100%"
      style={styles.footer}
    >
      <View padding-5 gap-10>
        <Text h3B>
          {Math.round(parseInt(route.duration.split('s')[0]) / 60)} นาที (
          {serviceSpotUtil.getDistanceText(route.distanceMeters)})
        </Text>
        <View>
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
        </View>
      </View>

      <Button label="เรียกรับบริการ" disabled={!route} onPress={requestDrive} />
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  }
})
