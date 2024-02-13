import { Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { Alert, Linking, StyleSheet, ScrollView } from "react-native";
import { View, Text, LoaderScreen, Button, Image } from "react-native-ui-lib";
import MapView, { MapMarker, PROVIDER_GOOGLE } from "react-native-maps";
import { URLSearchParams } from "react-native-url-polyfill";
import { useQuery } from "react-query";
import { serviceSpotsApi } from "../../apis/service-spots";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Params = {
  slug: string;
};

function ServiceSpotDetail() {
  const { slug } = useLocalSearchParams<Params>();
  const serviceSpotId = useMemo(() => parseInt(slug!), [slug]);

  const { data: serviceSpot } = useQuery(["service-spots", serviceSpotId], () =>
    serviceSpotsApi.getServiceSpotById(serviceSpotId)
  );

  const shouldDisableRouteButton = useMemo(() => {
    return !serviceSpot?.coords.lat || !serviceSpot?.coords.lng;
  }, [serviceSpot?.coords.lat, serviceSpot?.coords.lng]);

  const openRouteViewInMapApplication = useCallback(async () => {
    const searchParams = new URLSearchParams();
    searchParams.append("api", "1");
    searchParams.append(
      "destination",
      `${serviceSpot?.coords.lat},${serviceSpot?.coords.lng}`
    );
    const url = `https://www.google.com/maps/dir/?${searchParams.toString()}`;
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert("ไม่สามารถเปิดแผนที่ได้");
    }
    await Linking.openURL(url);
  }, [serviceSpot?.coords.lat, serviceSpot?.coords.lng]);

  if (!serviceSpot) {
    return <LoaderScreen />;
  }

  return (
    <ScrollView>
      <View flex-1>
        <Stack.Screen options={{ title: serviceSpot?.name }} />
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: serviceSpot.coords.lat || 0,
            longitude: serviceSpot.coords.lng || 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          maxZoomLevel={15}
          minZoomLevel={15}
          showsUserLocation
        >
          <MapMarker
            key={serviceSpot?.id}
            coordinate={{
              latitude: serviceSpot.coords.lat || 0,
              longitude: serviceSpot.coords.lng || 0,
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
                <FontAwesome5 name="map-marked-alt" size={20} color="#FDA84B" />
                <View paddingL-10>
                  <Text $textPrimary bodyB>
                    เส้นทาง
                  </Text>
                </View>
              </Button>
            </View>
          </View>
          <View>
            <Text>
              {serviceSpot.addressLine1} {serviceSpot?.addressLine2 || ""}{" "}
              {
                // @ts-ignore
                serviceSpot.address.nameTH
              }{" "}
              {
                // @ts-ignore
                serviceSpot.address.district.nameTH
              }{" "}
              {
                // @ts-ignore
                serviceSpot.address.district.province.nameTH
              }
            </Text>
          </View>
          <View paddingV-5>
            <View row centerV>
              <Button bg-transparent avoidMinWidth avoidInnerPadding>
                <MaterialCommunityIcons
                  name="currency-btc"
                  size={20}
                  color="#FDA84B"
                />
                <Text $textPrimary>อัตราค่าบริการ</Text>
              </Button>
            </View>
          </View>
          <View paddingV-5>
            <Text bodyB>ผู้ดูแล</Text>
            <View row paddingV-5>
              <View paddingL-10>
                <Image
                  borderRadius={25}
                  height={50}
                  width={50}
                  source={{
                    uri: "https://static.amarintv.com/images/upload/editor/source/PAI/2022/News/FEB/4u1a0152.jpg",
                  }}
                />
              </View>
              <View paddingL-10>
                <Text bodyB>นายบุญมี ใจดี</Text>
                <Text>วินหมายเลข 1</Text>
              </View>
            </View>
            {/* <Text>
          {serviceSpotOwner?.firstName} {serviceSpotOwner?.lastName}
        </Text> */}
          </View>
          <View paddingV-5>
            <View row>
              <View flex-1 left>
                <Text bodyB>สมาชิก</Text>
              </View>
              <View flex right>
                <Button bg-transparent avoidMinWidth avoidInnerPadding>
                  <Text $textPrimary>ดูทั้งหมด</Text>
                </Button>
              </View>
            </View>
            <View row paddingV-5>
              <View paddingL-10>
                <Image
                  borderRadius={25}
                  height={50}
                  width={50}
                  source={{
                    uri: "https://mpics.mgronline.com/pics/Images/563000001291201.JPEG",
                  }}
                />
              </View>
              <View paddingL-10>
                <Text bodyB>นายรังสรรค์ มีสุข</Text>
                <Text>วินหมายเลข 4</Text>
              </View>
            </View>
            <View row paddingV-5>
              <View paddingL-10>
                <Image
                  borderRadius={25}
                  height={50}
                  width={50}
                  source={{
                    uri: "https://www.matichon.co.th/wp-content/uploads/2019/11/87-2.jpg",
                  }}
                />
              </View>
              <View paddingL-10>
                <Text bodyB>นายอัศวิน ใจดี</Text>
                <Text>วินหมายเลข 5</Text>
              </View>
            </View>
            {/* <Text>
          {serviceSpotOwner?.firstName} {serviceSpotOwner?.lastName}
        </Text> */}
          </View>
          <View paddingV-5>
            <Button bg-transparent avoidMinWidth avoidInnerPadding>
              <Image
                borderRadius={25}
                cover
                source={{
                  uri: "https://theurbanis.com/wp-content/uploads/2020/04/image1-1.jpg",
                }}
              />
            </Button>
          </View>
        </View>
        <View
          bg-white
          style={{
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}
        >
          <View paddingV-10 paddingH-10>
            <Button bodyB label="เรียกรับบริการ" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 200,
  },
});

export default ServiceSpotDetail;
