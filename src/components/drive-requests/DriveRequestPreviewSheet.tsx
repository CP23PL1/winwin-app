import { commonUtil } from '@/utils/common'
import { serviceSpotUtil } from '@/utils/service-spot'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { ActivityIndicator } from 'react-native'
import { View, Text, Button, Colors } from 'react-native-ui-lib'

type Props = {
  route: any
  isRequesting: boolean
  requestDrive: () => void
}

export default function DriveRequestPreviewSheet({
  route,
  isRequesting,
  requestDrive
}: Props) {
  return (
    <BottomSheet snapPoints={['30%']}>
      <BottomSheetView style={{ flex: 1, padding: 15, gap: 20 }}>
        {!isRequesting ? (
          <>
            <View>
              <Text h3B>
                {Math.round(parseInt(route.duration.split('s')[0]) / 60)} นาที (
                {serviceSpotUtil.getDistanceText(route.distanceMeters)})
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
              disabled={isRequesting}
              onPress={requestDrive}
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
