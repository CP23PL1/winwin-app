import { usersApi } from '@/apis/users'
import DriveRequestList from '@/components/drive-requests/DriveRequestList'
import DriveRequestListEmpty from '@/components/drive-requests/DriveRequestListEmpty'
import { useInfiniteQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useMemo } from 'react'
import { ActivityIndicator } from 'react-native'
import { RefreshControl } from 'react-native-gesture-handler'
import { Colors, LoaderScreen, View } from 'react-native-ui-lib'

export default function DriveRequestsScreen() {
  const {
    data: driveRequests,
    isFetching,
    hasNextPage,
    fetchNextPage,
    refetch: refetchDriveRequests
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

  const data = useMemo(
    () => driveRequests?.pages.flatMap((page) => page.data) ?? [],
    [driveRequests]
  )

  if (!driveRequests) {
    return <LoaderScreen />
  }

  return data.length <= 0 ? (
    <DriveRequestListEmpty />
  ) : (
    <DriveRequestList
      data={data}
      listProps={{
        contentContainerStyle: {
          padding: 10
        },
        snapToEnd: true,
        refreshControl: (
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetchDriveRequests}
          />
        ),
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
        router.navigate(`/drive-requests/${driveRequest.id}`)
      }
      onEndReached={() => !isFetching && fetchNextPage()}
    />
  )
}
