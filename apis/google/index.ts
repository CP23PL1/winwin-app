import axios from 'axios'
import { GetRoutesRequest, GetRoutesResponse } from './type'

class GoogleApi {
  private readonly ROUTES_API_KEY = 'AIzaSyDlofTNj3uW2LX_5PyRsakpPtfhzFx93-s'
  getRoutes(data: GetRoutesRequest) {
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
}

export const googleApi = new GoogleApi()
