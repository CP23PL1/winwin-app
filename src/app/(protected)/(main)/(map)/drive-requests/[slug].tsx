import { driveRequestsApi } from '@/apis/drive-requests'
import Waypoint from '@/components/Waypoint'
import DriverInfo from '@/components/drive-requests/DriverInfo'
import CustomMarkerImage from '@/components/map/CustomMarkerImage'
import { DriveRequest } from '@/sockets/drive-request/type'
import { commonUtil } from '@/utils/common'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router/src/hooks'
import moment from 'moment'
import { useEffect, useRef } from 'react'
import MapView, { Marker } from 'react-native-maps'
import {
  Avatar,
  Card,
  Colors,
  SkeletonView,
  Text,
  View
} from 'react-native-ui-lib'

export default function DriveRequestDetailScreen() {
  const map = useRef<MapView | null>(null)
  const { slug } = useLocalSearchParams()

  const { data: driveRequest } = useQuery({
    queryKey: ['drive-requests', slug],
    queryFn: () => driveRequestsApi.getDriveRequestById(slug as string),
    enabled: !!slug
  })

  useEffect(() => {
    if (!map.current) return
    map.current?.fitToSuppliedMarkers(['origin', 'destination'], {
      edgePadding: { top: 100, right: 100, bottom: 100, left: 100 }
    })
  }, [map.current])

  return (
    <SkeletonView
      style={{
        backgroundColor: 'white',
        padding: 10,
        margin: 5,
        borderRadius: 15
      }}
      times={4}
      template={SkeletonView.templates.TEXT_CONTENT}
      showContent={!!driveRequest}
      customValue={driveRequest}
      renderContent={(driveRequest: DriveRequest) => (
        <View padding-20 gap-10>
          <MapView
            ref={map}
            style={{ height: 180, width: '100%' }}
            initialRegion={{
              latitude: driveRequest.origin.location.lat,
              longitude: driveRequest.origin.location.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          >
            <Marker
              identifier="origin"
              coordinate={{
                latitude: driveRequest.origin.location.lat,
                longitude: driveRequest.origin.location.lng
              }}
            >
              <CustomMarkerImage color="blue" />
            </Marker>
            <Marker
              identifier="destination"
              coordinate={{
                latitude: driveRequest.destination.location.lat,
                longitude: driveRequest.destination.location.lng
              }}
            >
              <CustomMarkerImage color="red" />
            </Marker>
          </MapView>
          <Card gap-10 padding-10>
            <Waypoint
              placeDetail={driveRequest.origin}
              color={Colors.blue40}
              useDivider={false}
            />
            <Waypoint
              placeDetail={driveRequest.destination}
              color={Colors.red40}
              useDivider={false}
            />
          </Card>
          <Card padding-15>
            <Text h5B marginB-10>
              ข้อมูลการโดยสาร
            </Text>
            <View row spread>
              <Text>รหัสการโดยสาร</Text>
              <Text caption>{driveRequest.id}</Text>
            </View>
            <View row spread>
              <Text>วันที่</Text>
              <Text caption>
                {moment(driveRequest.createdAt).format('DD/MM/YYYY HH:mm')}
              </Text>
            </View>
            <View row spread>
              <Text>ค่าโดยสารทั้งหมด</Text>
              <Text bodyB>
                {commonUtil.formatCurrency(driveRequest.paidAmount)}
              </Text>
            </View>
          </Card>
          <Card padding-15>
            <Text h5B marginB-10>
              ข้อมูลผู้ขับ
            </Text>
            <DriverInfo driver={driveRequest.driver} />
          </Card>
        </View>
      )}
    />
  )
}
