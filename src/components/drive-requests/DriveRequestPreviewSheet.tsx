import { commonUtil } from '@/utils/common'
import { serviceSpotUtil } from '@/utils/service-spot'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { useMemo } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { View, Text, Button, Colors } from 'react-native-ui-lib'
import { AntDesign } from '@expo/vector-icons'

type Props = {
  route: any
  isRequesting: boolean
  maxDistanceMeters: number
  requestDrive: () => void
  onCancel: () => void
}

export default function DriveRequestPreviewSheet({
  route,
  isRequesting,
  maxDistanceMeters,
  requestDrive,
  onCancel
}: Props) {
  const exceedsMaxDistance = useMemo(() => {
    if (!route) return false
    return route.distanceMeters > maxDistanceMeters
  }, [route, maxDistanceMeters])

  if (exceedsMaxDistance) {
    return (
      <BottomSheet snapPoints={['25%']}>
        <BottomSheetView style={styles.container}>
          <View center gap-5>
            <Text h5B>ปลายทางของคุณอยู่นอกเขตพื้นที่ให้บริการ</Text>
            <Text caption>
              เนื่องจากระยะทางเกิน{' '}
              {serviceSpotUtil.getDistanceText(maxDistanceMeters)}{' '}
              หากต้องการเดินทางข้ามเขตพื้นที่ให้บริการ
              กรุณาติดต่อวินมอเตอร์ไซค์ใกล้เคียง
            </Text>
          </View>
          <Button
            label="ปิด"
            backgroundColor={Colors.$backgroundDark}
            white
            onPress={onCancel}
          />
        </BottomSheetView>
      </BottomSheet>
    )
  }

  return (
    <BottomSheet snapPoints={['30%']}>
      <BottomSheetView style={styles.container}>
        {!isRequesting ? (
          <>
            <View>
              <Text h3B>
                {Math.round(parseInt(route.duration.split('s')[0]) / 60)} นาที (
                {serviceSpotUtil.getDistanceText(route.distanceMeters)})
              </Text>
              <View>
                {!exceedsMaxDistance && (
                  <>
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
                  </>
                )}
              </View>
            </View>

            <Button
              label="เรียกรับบริการ"
              disabled={isRequesting}
              onPress={requestDrive}
            />
            <AntDesign
              name="close"
              size={28}
              color={Colors.$iconDanger}
              style={styles.closeIcon}
              onPress={onCancel}
            />
          </>
        ) : (
          <View flex center gap-20>
            <ActivityIndicator size="large" color={Colors.$iconPrimary} />
            <Text>กำลังเรียกรับบริการ...</Text>
          </View>
        )}
      </BottomSheetView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    gap: 20
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10
  }
})
