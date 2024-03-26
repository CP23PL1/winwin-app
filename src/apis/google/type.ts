import {
  AddressComponent,
  Geometry,
  GooglePlaceDetail,
  PlaceType,
  PlusCode
} from 'react-native-google-places-autocomplete'

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
