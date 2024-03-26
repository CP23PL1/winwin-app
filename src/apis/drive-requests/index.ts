import axiosInstance from '@/libs/axios'
import { Coordinate } from '../shared/type'
import { DriveRequestPreviewResponse } from './types'

class DriveRequestsApi {
  async previewRoute(origin: Coordinate, destination: Coordinate) {
    return axiosInstance
      .post<DriveRequestPreviewResponse>('/drive-requests/preview', {
        origin,
        destination
      })
      .then((res) => res.data)
  }
}

export const driveRequestsApi = new DriveRequestsApi()
