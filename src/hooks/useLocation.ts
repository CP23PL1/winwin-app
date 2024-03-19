import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

export function useLocation() {
  const [location, setLocation] = useState<Geolocation.GeoPosition | null>(null)
  const [error, setError] = useState<Geolocation.GeoError | null>(null)

  const getCurrentPositionAsync = async () => {
    if (Platform.OS === 'ios') {
      const status = await Geolocation.requestAuthorization('whenInUse')
      if (status !== 'granted') {
        throw new Error('Permission to access location was denied')
      }
    }
    console.log('Permission granted')
    console.log('Getting current location')
    const location = await new Promise(Geolocation.getCurrentPosition)
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
