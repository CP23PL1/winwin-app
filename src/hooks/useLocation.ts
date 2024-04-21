import { useEffect, useState } from 'react'
import * as Location from 'expo-location'
import { Platform } from 'react-native'

export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [error, setError] = useState('')

  const getCurrentPositionAsync = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied')
    }
    console.log('Permission granted')
    console.log('Getting current location')
    const location = await Location.getCurrentPositionAsync({})
    console.log('Got current location')
    console.log(
      `Location: ${location.coords.latitude}, ${location.coords.longitude}`
    )

    return location
  }

  useEffect(() => {
    getCurrentPositionAsync().then(setLocation).catch(setError)
  }, [])

  return { location, error }
}
