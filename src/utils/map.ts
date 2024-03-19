import { LatLng } from 'react-native-maps'

class MapUtil {
  decodePolyline(polyline: string): LatLng[] {
    const len = polyline.length
    let index = 0
    const array: LatLng[] = []
    let lat = 0
    let lng = 0
    while (index < len) {
      let b
      let shift = 0
      let result = 0
      do {
        b = polyline.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
      lat += dlat
      shift = 0
      result = 0
      do {
        b = polyline.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
      lng += dlng
      array.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5
      })
    }
    return array
  }
}

export const mapUtil = new MapUtil()
