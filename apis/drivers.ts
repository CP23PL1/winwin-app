import { DriversApi } from '@cp23pl1/winwin-client-sdk'
import { useQuery } from 'react-query'

const driversApi = new DriversApi({
  basePath: process.env.EXPO_PUBLIC_API_URL,
  isJsonMime: (mime) => mime.includes('application/json')
})

export const useGetDriverByUid = (uid?: string) => {
  return useQuery({
    queryKey: ['drivers', uid],
    queryFn: () => driversApi.findOne(uid!, 'uid').then((res) => res.data),
    enabled: !!uid
  })
}
