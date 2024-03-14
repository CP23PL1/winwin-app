import React, { useCallback } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Text, View } from 'react-native-ui-lib'
import { commonUtil } from '../../../utils/common'
import { serviceSpotUtil } from '../../../utils/service-spot'
import { SERVICE_CHARGE } from '../../../constants/service-spots'
import { useDriveRequestContext } from '../../../contexts/DriveRequestContext'
import { router } from 'expo-router'
import RouteCard from '../../../components/RouteCard'

export default function MainScreen() {
  const {
    location,
    route,
    price,
    origin,
    setOrigin,
    destination,
    setDestination,
    createDriveRequest
  } = useDriveRequestContext()

  const handleDriveRequestRequested = useCallback(async () => {
    await createDriveRequest()
    router.push('/drive-requests')
  }, [createDriveRequest])

  return !route ? (
    <SafeAreaView style={{ marginTop: 10, alignItems: 'center' }}>
      <RouteCard
        currentLocation={location}
        origin={origin}
        destination={destination}
        onOriginChange={setOrigin}
        onDestinationChange={setDestination}
      />
    </SafeAreaView>
  ) : (
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
          onPress={handleDriveRequestRequested}
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
