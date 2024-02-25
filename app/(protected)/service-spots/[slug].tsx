import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import {
  Alert,
  Linking,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native'
import { View, Text, LoaderScreen, Button, Image } from 'react-native-ui-lib'
import MapView, { MapMarker, PROVIDER_GOOGLE } from 'react-native-maps'
import { URLSearchParams } from 'react-native-url-polyfill'
import { useQuery } from '@tanstack/react-query'
import { serviceSpotsApi } from '../../../apis/service-spots'
import { FontAwesome5 } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import ImageViewerModal from '../../../components/ImageViewerModal'
import CardModal from '../../../components/CardModal'
import { AntDesign } from '@expo/vector-icons'

type Params = {
  slug: string
}

function ServiceSpotDetail() {
  const router = useRouter()
  const { slug } = useLocalSearchParams<Params>()
  const serviceSpotId = useMemo(() => parseInt(slug!), [slug])
  const [showPriceRateImageModal, setShowPriceRateImageModal] = useState(false)
  const [showSpotOwnerModal, setShowSpotOwnerModal] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')

  const width = Dimensions.get('window').width

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

  if (!serviceSpot) {
    return <LoaderScreen />
  }

  const showWinWinCard = () => {
    setPhoneNumber(
      serviceSpot.serviceSpotOwner.phoneNumber.replace(/\+66/g, '0')
    )
    setShowSpotOwnerModal(true)
  }

  return (
    <View flex-1 height="100%">
      <Stack.Screen
        options={{
          title: serviceSpot.name
        }}
      />
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
            src={serviceSpot.serviceSpotOwner.profileImage}
          />
        </View>
        <View paddingV-10 center>
          <Text h4B white>
            {serviceSpot.serviceSpotOwner.firstName}{' '}
            {serviceSpot.serviceSpotOwner.lastName}
          </Text>
        </View>
        <View paddingV-10 center>
          <Text h4B white>
            {phoneNumber}
          </Text>
        </View>
        <View paddingV-10 center>
          <Text h4B white center>
            {serviceSpot.serviceSpotOwner.vehicle.manufactor}{' '}
            {serviceSpot.serviceSpotOwner.vehicle.model}
          </Text>
        </View>
        <View paddingV-10 center>
          <Text h4B white center>
            {serviceSpot.serviceSpotOwner.vehicle.plate}
          </Text>
          <Text h4B white center>
            {serviceSpot.serviceSpotOwner.vehicle.province}
          </Text>
        </View>
      </CardModal>
      <ScrollView>
        <View flex-1>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
              latitude: serviceSpot.coords.lat || 0,
              longitude: serviceSpot.coords.lng || 0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            maxZoomLevel={15}
            minZoomLevel={15}
            showsMyLocationButton={false}
            showsUserLocation
          >
            <MapMarker
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
              <Text>
                {serviceSpot.addressLine1} {serviceSpot?.addressLine2 || ''}
                {
                  // @ts-ignore
                  serviceSpot.address.nameTH
                }{' '}
                {
                  // @ts-ignore
                  serviceSpot.address.district.nameTH
                }{' '}
                {
                  // @ts-ignore
                  serviceSpot.address.district.province.nameTH
                }
              </Text>
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
              <View left paddingT-10>
                <Button
                  bg-transparent
                  avoidMinWidth
                  avoidInnerPadding
                  onPress={() => router.push('./calculate-price')}
                >
                  <View paddingH-5>
                    <AntDesign name="calculator" size={20} color="#FDA84B" />
                  </View>
                  <Text bodyB primary>
                    อัตราค่าบริการตามระยะทาง
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
                        uri: serviceSpot.serviceSpotOwner.profileImage
                      }}
                    />
                  </View>
                  <View paddingL-10>
                    <Text bodyB>
                      {serviceSpot?.serviceSpotOwner?.firstName}{' '}
                      {serviceSpot?.serviceSpotOwner?.lastName}
                    </Text>
                    <Text>วินหมายเลข {serviceSpot.serviceSpotOwner.no}</Text>
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
      <View
        bg-white
        style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
      >
        <View paddingV-10 paddingH-10>
          <Button bodyB label="เรียกรับบริการ" />
        </View>
      </View>
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
