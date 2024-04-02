import axiosInstance from '@/libs/axios'
import { Coordinate } from '../shared/type'
import { CreateFeedback, DriveRequestPreviewResponse } from './types'

class DriveRequestsApi {
  async previewRoute(origin: Coordinate, destination: Coordinate) {
    return axiosInstance
      .post<DriveRequestPreviewResponse>('/drive-requests/preview', {
        origin,
        destination
      })
      .then((res) => res.data)
  }
  async submitFeedback(data: CreateFeedback) {
    return axiosInstance.post(
      `/drive-requests/${data.driveRequestId}/feedback`,
      {
        rating: data.rating,
        category: data.category
      }
    )
  }
}

export const driveRequestsApi = new DriveRequestsApi()
