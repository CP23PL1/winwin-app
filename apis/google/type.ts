import { LatLng } from 'react-native-maps'

export type Waypoint = {
  location?: {
    latLng: LatLng
  }
  placeId?: string
}

export type GetRoutesRequest = {
  origin: Waypoint
  destination: Waypoint
  travelMode:
    | 'TRAVEL_MODE_UNSPECIFIED'
    | 'DRIVE'
    | 'WALK'
    | 'BICYCLE'
    | 'TRANSIT'
    | 'TWO_WHEELER'
  languageCode: string
  units: 'IMPERIAL' | 'METRIC'
}

export type GetRoutesResponse = {
  routes: {
    duration: string
    distanceMeters: number
    polyline: {
      encodedPolyline: string
    }
  }[]
}
