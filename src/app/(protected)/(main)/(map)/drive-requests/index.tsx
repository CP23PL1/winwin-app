import { usersApi } from '@/apis/users'
import DriveRequestList from '@/components/drive-requests/DriveRequestList'
import { useInfiniteQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { ActivityIndicator } from 'react-native'
import { Colors, LoaderScreen, Text, View } from 'react-native-ui-lib'

export default function DriveRequestsScreen() {
  const {
    data: driveRequests,
    isFetching,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['drive-requests'],
    queryFn: ({ pageParam }) =>
      usersApi.getMyDriveRequests({ page: pageParam }),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.meta.currentPage + 1
      return nextPage <= lastPage.meta.totalPages ? nextPage : undefined
    },
    initialPageParam: 0
  })

  if (!driveRequests) {
    return <LoaderScreen />
  }

  return (
    <DriveRequestList
      data={driveRequests.pages.flatMap((page) => page.data)}
      listProps={{
        contentContainerStyle: {
          padding: 10
        },
        snapToEnd: true,
        ListFooterComponent: () =>
          hasNextPage && (
            <View center paddingV-20>
              {isFetching && (
                <ActivityIndicator
                  size="large"
                  color={Colors.$backgroundPrimaryHeavy}
                />
              )}
            </View>
          )
      }}
      onDriveRequestPress={(driveRequest) =>
        router.push(`/drive-requests/${driveRequest.id}`)
      }
      onEndReached={() => !isFetching && fetchNextPage()}
    />
  )
}
