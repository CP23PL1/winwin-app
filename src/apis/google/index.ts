import axios from 'axios'
import {
  GetReverseGeocodeResponse,
  GetRoutesRequest,
  GetRoutesResponse
} from './type'
import { LatLng } from 'react-native-maps'

class GoogleApi {
  private readonly ROUTES_API_KEY = 'AIzaSyDlofTNj3uW2LX_5PyRsakpPtfhzFx93-s'
  private readonly PLACES_API_KEY = 'AIzaSyDMcuFdAqM9SvGP0D5ImQ7b8sZ0SDzFBJo'

  async getRoutes(data: GetRoutesRequest) {
    return axios
      .post<GetRoutesResponse>(
        'https://routes.googleapis.com/directions/v2:computeRoutes',
        data,
        {
          headers: {
            'X-Goog-Api-Key': this.ROUTES_API_KEY,
            'X-Goog-FieldMask':
              'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
          }
        }
      )
      .then((res) => res.data)
  }

  async reverseGeocode(
    latLng: LatLng,
    resultType: string | undefined = 'street_address'
  ) {
    return axios
      .get<GetReverseGeocodeResponse>(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: {
            latlng: `${latLng.latitude},${latLng.longitude}`,
            key: this.PLACES_API_KEY,
            result_type: resultType
          }
        }
      )
      .then((res) => res.data.results[0])
  }
}

export const googleApi = new GoogleApi()
