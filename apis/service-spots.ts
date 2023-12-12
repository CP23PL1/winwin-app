import { ServiceSpotsApi, AddressesApi } from '@cp23pl1/winwin-client-sdk'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

const serviceSpotsApi = new ServiceSpotsApi({
  basePath: process.env.EXPO_PUBLIC_API_URL,
  isJsonMime: (mime) => mime.includes('application/json')
})

export const useGetServiceSpots = (
  lat?: number,
  lng?: number,
  radius?: number
) => {
  const enabled = useMemo(
    () => lat != null && lng != null && radius != null,
    [lat, lng, radius]
  )

  return useQuery({
    queryKey: ['service-spots'],
    queryFn: () =>
      serviceSpotsApi.findAll(lat!, lng!, radius!).then((res) => res.data),
    staleTime: 10000, // 10 seconds
    enabled
  })
}

export const useGetServiceSpotById = (id: number) => {
  return useQuery({
    queryKey: ['service-spots', id],
    queryFn: () => serviceSpotsApi.findOne(id).then((res) => res.data)
  })
}
