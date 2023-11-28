import { useEffect, useState } from 'react'
import * as Location from 'expo-location'
import { Alert } from 'react-native'

export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied')
      return
    }

    const location = await Location.getCurrentPositionAsync({})
    setLocation(location)
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  return location
}
