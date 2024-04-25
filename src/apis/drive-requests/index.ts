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
  async submitFeedback({
    driveRequestId,
    data
  }: {
    driveRequestId: DriveRequest['id']
    data: CreateFeedback[]
  }) {
    return axiosInstance.post(
      `/drive-requests/${driveRequestId}/feedback`,
      data
    )
  }
}

export const driveRequestsApi = new DriveRequestsApi()
