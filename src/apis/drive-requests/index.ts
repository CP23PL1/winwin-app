import axiosInstance from '@/libs/axios'
import { Coordinate } from '../shared/type'
import { CreateFeedback, DriveRequestPreviewResponse } from './types'
import { DriveRequest } from '@/sockets/drive-request/type'

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
  async getDriveRequestById(id: string) {
    return axiosInstance
      .get<DriveRequest>(`/drive-requests/${id}`)
      .then((res) => res.data)
  }
}

export const driveRequestsApi = new DriveRequestsApi()
