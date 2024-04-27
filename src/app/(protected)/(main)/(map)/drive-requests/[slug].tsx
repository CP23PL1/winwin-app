import { usersApi } from '@/apis/users'
import Waypoint from '@/components/Waypoint'
import DriverInfo from '@/components/drive-requests/DriverInfo'
import { DriveRequestDetail } from '@/sockets/drive-request/type'
import { commonUtil } from '@/utils/common'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import MapView, { Marker } from 'react-native-maps'
import { Card, Colors, SkeletonView, Text, View } from 'react-native-ui-lib'

export default function DriveRequestDetailScreen() {
  const [trackViewChange, setTrackViewChange] = useState(true)
  const map = useRef<MapView | null>(null)
  const { slug } = useLocalSearchParams()

  const { data: driveRequest } = useQuery({
    queryKey: ['drive-requests', slug],
    queryFn: () => usersApi.getMyDriveRequestById(slug as string),
    enabled: !!slug
  })

  useEffect(() => {
    if (!map.current) return
    map.current?.fitToSuppliedMarkers(['origin', 'destination'])
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
      renderContent={(driveRequest: DriveRequestDetail) => (
        <View padding-20 gap-10>
          <MapView
            ref={map}
            style={{ height: 180, width: '100%' }}
            initialRegion={{
              latitude: driveRequest.origin.location.lat,
              longitude: driveRequest.origin.location.lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            }}
            onMapLoaded={() => setTrackViewChange(false)}
          >
            <Marker
              identifier="origin"
              coordinate={{
                latitude: driveRequest.origin.location.lat,
                longitude: driveRequest.origin.location.lng
              }}
              icon={require('../../../../../../assets/map_marker_blue.png')}
              tracksViewChanges={trackViewChange}
            />
            <Marker
              identifier="destination"
              coordinate={{
                latitude: driveRequest.destination.location.lat,
                longitude: driveRequest.destination.location.lng
              }}
              icon={require('../../../../../../assets/map_marker_red.png')}
              tracksViewChanges={trackViewChange}
            />
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
            <DriverInfo driver={driveRequest.driver.info} />
          </Card>
        </View>
      )}
    />
  )
}
