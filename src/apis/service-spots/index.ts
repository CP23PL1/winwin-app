import axiosInstance from '@/libs/axios'
import { GetNearbyServiceSpotsParams, ServiceSpot } from './type'

class ServiceSpotsApi {
  async getNearbyServiceSpots(params: Partial<GetNearbyServiceSpotsParams>) {
    return axiosInstance<ServiceSpot[]>('/service-spots', { params }).then(
      (res) => res.data
    )
  }

  async getServiceSpotById(id: number) {
    return axiosInstance<ServiceSpot>(`/service-spots/${id}`).then(
      (res) => res.data
    )
  }
}

export const serviceSpotsApi = new ServiceSpotsApi()
