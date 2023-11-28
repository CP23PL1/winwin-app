import { ServiceSpotsApi } from '@cp23pl1/winwin-client-sdk'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

const serviceSpotsApi = new ServiceSpotsApi({
  basePath: 'https://capstone23.sit.kmutt.ac.th/pl1',
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
    enabled
  })
}

export const useGetServiceSpotById = (id: number) => {
  return useQuery({
    queryKey: ['service-spots', id],
    queryFn: () => serviceSpotsApi.findOne(id).then((res) => res.data)
  })
}
