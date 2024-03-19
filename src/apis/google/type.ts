import {
  AddressComponent,
  Geometry,
  GooglePlaceDetail,
  PlaceType,
  PlusCode
} from 'react-native-google-places-autocomplete'
import { LatLng } from 'react-native-maps'

export type Route = {
  duration: string
  distanceMeters: number
  polyline: {
    encodedPolyline: string
  }
}

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
  routes: Route[]
}

export type MaskedPlaceDetail = Pick<
  GooglePlaceDetail,
  'place_id' | 'geometry' | 'name'
>
export type GetReverseGeocodeResponse = {
  plus_code: PlusCode
  results: {
    address_components: AddressComponent
    formatted_address: string
    geometry: Geometry
    place_id: string
    types: PlaceType[]
  }[]
  status: string
}
