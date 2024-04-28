import { Stack, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import { Alert, Linking, StyleSheet, ScrollView } from 'react-native'
import { View, Text, LoaderScreen, Button } from 'react-native-ui-lib'
import MapView from 'react-native-maps'
import { useQuery } from '@tanstack/react-query'
import { serviceSpotsApi } from '@/apis/service-spots'
import {
  FontAwesome5,
  MaterialCommunityIcons,
  SimpleLineIcons
} from '@expo/vector-icons'
import ImageViewerModal from '@/components/ImageViewerModal'
import ServiceSpotMarker from '@/components/service-spots/ServiceSpotMarker'
import DriverInfo from '@/components/drive-requests/DriverInfo'

type Params = {
  slug: string
}

function ServiceSpotDetail() {
  const { slug } = useLocalSearchParams<Params>()
  const serviceSpotId = useMemo(() => parseInt(slug!), [slug])
  const [showPriceRateImageModal, setShowPriceRateImageModal] = useState(false)

  const { data: serviceSpot } = useQuery({
    queryKey: ['service-spots', serviceSpotId],
    queryFn: () => serviceSpotsApi.getServiceSpotById(serviceSpotId)
  })

  const shouldDisableRouteButton = useMemo(() => {
    return !serviceSpot?.coords.lat || !serviceSpot?.coords.lng
  }, [serviceSpot?.coords.lat, serviceSpot?.coords.lng])

  const openRouteViewInMapApplication = useCallback(async () => {
    const searchParams = new URLSearchParams()
    searchParams.append('api', '1')
    searchParams.append(
      'destination',
      `${serviceSpot?.coords.lat},${serviceSpot?.coords.lng}`
    )
    const url = `https://www.google.com/maps/dir/?${searchParams.toString()}`
    const supported = await Linking.canOpenURL(url)

    if (!supported) {
      Alert.alert('ไม่สามารถเปิดแผนที่ได้')
      return
    }

    await Linking.openURL(url)
  }, [serviceSpot?.coords.lat, serviceSpot?.coords.lng])

  return (
    <View flex-1 height="100%">
      <Stack.Screen
        options={{
          title: serviceSpot?.name || 'Loading...'
        }}
      />
      {!serviceSpot ? (
        <LoaderScreen />
      ) : (
        <>
          <ImageViewerModal
            visible={showPriceRateImageModal}
            onRequestClose={() => setShowPriceRateImageModal(false)}
            imageViewerProps={{
              imageUrls: [{ url: serviceSpot.priceRateImageUrl }]
            }}
          />
          <ScrollView>
            <View flex-1>
              <MapView
                style={styles.map}
                region={{
                  latitude: serviceSpot.coords.lat || 0,
                  longitude: serviceSpot.coords.lng || 0,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421
                }}
                maxZoomLevel={15}
                minZoomLevel={15}
                showsUserLocation
                showsMyLocationButton={false}
                toolbarEnabled={false}
              >
                <ServiceSpotMarker
                  key={serviceSpot?.id}
                  coordinate={{
                    latitude: serviceSpot.coords.lat || 0,
                    longitude: serviceSpot.coords.lng || 0
                  }}
                />
              </MapView>
              <View paddingH-15 paddingV-5 paddingT-10>
                <View row paddingV-5>
                  <View flex-1 left>
                    <Text bodyB>ที่อยู่</Text>
                  </View>
                  <View flex-1 right>
                    <Button
                      onPress={openRouteViewInMapApplication}
                      disabled={shouldDisableRouteButton}
                      bg-transparent
                      avoidMinWidth
                      avoidInnerPadding
                    >
                      <FontAwesome5
                        name="map-marked-alt"
                        size={20}
                        color="#FDA84B"
                      />
                      <View paddingL-10>
                        <Text primary bodyB>
                          เส้นทาง
                        </Text>
                      </View>
                    </Button>
                  </View>
                </View>
                <View>
                  <Text>{serviceSpot.formattedAddress}</Text>
                </View>
                <View paddingV-5>
                  <View row centerV>
                    <Button
                      bg-transparent
                      avoidMinWidth
                      avoidInnerPadding
                      onPress={() => setShowPriceRateImageModal(true)}
                    >
                      <View paddingH-5>
                        <MaterialCommunityIcons
                          name="currency-btc"
                          size={20}
                          color="#FDA84B"
                        />
                      </View>

                      <Text bodyB primary>
                        อัตราค่าบริการ
                      </Text>
                    </Button>
                  </View>
                </View>
                <View paddingV-5 gap-10>
                  <Text bodyB>ผู้ดูแล</Text>
                  <View row centerV spread>
                    <DriverInfo driver={serviceSpot.serviceSpotOwner.info} />
                    <SimpleLineIcons
                      name="phone"
                      size={24}
                      style={{ padding: 15 }}
                      onPress={() =>
                        Linking.openURL(
                          `tel:${serviceSpot.serviceSpotOwner.info?.phoneNumber}`
                        )
                      }
                    />
                  </View>
                </View>
                {/* <View paddingV-10>
              <Button bg-transparent avoidMinWidth avoidInnerPadding>
                <Carousel
                  loop
                  width={width}
                  height={width / 2}
                  autoPlay={true}
                  data={images}
                  scrollAnimationDuration={5000}
                  onSnapToItem={(index) => console.log("current index:", index)}
                  renderItem={({ index }) => (
                    <View flex-1 paddingH-10>
                      <Image
                        borderRadius={25}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        source={{
                          uri: images[index],
                        }}
                      />
                    </View>
                  )}
                />
              </Button>
            </View> */}
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 200
  }
})

export default ServiceSpotDetail
