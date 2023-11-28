import { Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'
import { View } from 'react-native-ui-lib'
import { useGetServiceSpotById } from '../../apis/service-spots'
import MapView, { MapMarker } from 'react-native-maps'

type Params = {
  slug: string
}

function ServiceSpotDetail() {
  const { slug } = useLocalSearchParams<Params>()
  const { data: serviceSpot } = useGetServiceSpotById(parseInt(slug))

  return (
    <View flex-1>
      <Stack.Screen options={{ title: serviceSpot?.name }} />
      <MapView
        style={styles.map}
        region={{
          latitude: (serviceSpot?.coords as any)?.coordinates[1] || 0,
          longitude: (serviceSpot?.coords as any)?.coordinates[0] || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
        maxZoomLevel={15}
        minZoomLevel={15}
        showsUserLocation
      >
        <MapMarker
          key={serviceSpot?.id}
          coordinate={{
            latitude: (serviceSpot?.coords as any)?.coordinates[1] || 0,
            longitude: (serviceSpot?.coords as any)?.coordinates[0] || 0
          }}
        />
      </MapView>
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
