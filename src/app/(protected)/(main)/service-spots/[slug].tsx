import { Stack, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import { Alert, Linking, StyleSheet, ScrollView } from 'react-native'
import { View, Text, LoaderScreen, Button, Image } from 'react-native-ui-lib'
import MapView, { Marker } from 'react-native-maps'
import { useQuery } from '@tanstack/react-query'
import { serviceSpotsApi } from '@/apis/service-spots'
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import ImageViewerModal from '@/components/ImageViewerModal'
import CardModal from '@/components/CardModal'
import ServiceSpotMarker from '@/components/service-spots/ServiceSpotMarker'

type Params = {
  slug: string
}

function ServiceSpotDetail() {
  const { slug } = useLocalSearchParams<Params>()
  const serviceSpotId = useMemo(() => parseInt(slug!), [slug])
  const [showPriceRateImageModal, setShowPriceRateImageModal] = useState(false)
  const [showSpotOwnerModal, setShowSpotOwnerModal] = useState(false)

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

  const showWinWinCard = () => {
    setShowSpotOwnerModal(true)
  }

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
          <CardModal
            visible={showSpotOwnerModal}
            onRequestClose={() => setShowSpotOwnerModal(false)}
          >
            <View center>
              <Text h1B white>
                บัตร WinWin
              </Text>
            </View>
            <View center>
              <Image
                borderRadius={100}
                style={{ height: 150, width: 150 }}
                src={serviceSpot.serviceSpotOwner.info.profileImage}
              />
            </View>
            <View paddingV-10 center>
              <Text h4B white>
                {serviceSpot.serviceSpotOwner.info.firstName}{' '}
                {serviceSpot.serviceSpotOwner.info.lastName}
              </Text>
            </View>
            <View paddingV-10 center>
              <Text h4B white>
                {serviceSpot.serviceSpotOwner.phoneNumber.replace(/\+66/g, '0')}
              </Text>
            </View>
            <View paddingV-10 center>
              <Text h4B white center>
                {serviceSpot.serviceSpotOwner.info.vehicle.manufactor}{' '}
                {serviceSpot.serviceSpotOwner.info.vehicle.model}
              </Text>
            </View>
            <View paddingV-10 center>
              <Text h4B white center>
                {serviceSpot.serviceSpotOwner.info.vehicle.plate}
              </Text>
              <Text h4B white center>
                {serviceSpot.serviceSpotOwner.info.vehicle.province}
              </Text>
            </View>
          </CardModal>
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
                <View paddingV-5>
                  <Text bodyB>ผู้ดูแล</Text>
                  <View row paddingV-10 paddingL-10>
                    <Button
                      bg-transparent
                      avoidMinWidth
                      avoidInnerPadding
                      onPress={() => showWinWinCard()}
                    >
                      <View>
                        <Image
                          borderRadius={25}
                          height={50}
                          width={50}
                          source={{
                            uri: serviceSpot.serviceSpotOwner.info.profileImage
                          }}
                        />
                      </View>
                      <View paddingL-10>
                        <Text bodyB>
                          {serviceSpot.serviceSpotOwner.info.firstName}{' '}
                          {serviceSpot.serviceSpotOwner.info.lastName}
                        </Text>
                        <Text>
                          วินหมายเลข {serviceSpot.serviceSpotOwner.info.no}
                        </Text>
                      </View>
                    </Button>
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
