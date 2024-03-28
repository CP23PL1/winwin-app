import React from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Colors, Text, View } from 'react-native-ui-lib'
import { commonUtil } from '@/utils/common'
import { serviceSpotUtil } from '@/utils/service-spot'
import { useDriveRequestContext } from '@/contexts/DriveRequestContext'
import RouteCard from '@/components/RouteCard'

export default function MainScreen() {
  const {
    isRequesting,
    location,
    route,
    origin,
    setOrigin,
    destination,
    setDestination,
    requestDrive
  } = useDriveRequestContext()

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: 10,
        alignItems: 'center',
        pointerEvents: 'box-none'
      }}
    >
      <RouteCard
        currentLocation={location}
        origin={origin}
        destination={destination}
        onOriginChange={setOrigin}
        onDestinationChange={setDestination}
      />
      {route && (
        <View
          absB
          absL
          bg-white
          padding-15
          gap-15
          width="100%"
          style={styles.footer}
        >
          {!isRequesting ? (
            <>
              <View padding-5 gap-10>
                <Text h3B>
                  {Math.round(parseInt(route.duration.split('s')[0]) / 60)} นาที
                  ({serviceSpotUtil.getDistanceText(route.distanceMeters)})
                </Text>
                <View>
                  <View row spread centerV>
                    <Text caption>ค่าโดยสาร (ตามอัตรา)</Text>
                    <Text body>
                      {commonUtil.formatCurrency(route.priceByDistance)}
                    </Text>
                  </View>
                  <View row spread centerV>
                    <Text caption>ค่าเรียก</Text>
                    <Text body>
                      {commonUtil.formatCurrency(route.serviceCharge)}
                    </Text>
                  </View>
                  <View row spread centerV>
                    <Text caption>ทั้งหมด</Text>
                    <Text h5B>{commonUtil.formatCurrency(route.total)}</Text>
                  </View>
                </View>
              </View>

              <Button
                label="เรียกรับบริการ"
                disabled={!route}
                onPress={requestDrive}
              />
            </>
          ) : (
            <>
              <ActivityIndicator
                size="large"
                color={Colors.$backgroundPrimaryHeavy}
              />
              <Text center>โปรดรอสักครู่ เรากำลังหาคนขับให้คุณ...</Text>
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  footer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  }
})
