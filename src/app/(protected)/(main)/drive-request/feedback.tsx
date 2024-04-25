import {
  View,
  Text,
  Colors,
  TouchableOpacity,
  Button
} from 'react-native-ui-lib'
import { Ionicons } from '@expo/vector-icons'
import { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDriveRequestContext } from '@/contexts/DriveRequestContext'
import { Redirect, Stack, router } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { driveRequestsApi } from '@/apis/drive-requests'
import { feedbackCategoryOptions } from '@/constants/feedback'
import { FeedbackCategory } from '@/apis/drive-requests/types'
import { FlatList } from 'react-native-gesture-handler'
import FeedbackCategoryListItem from '@/components/feedback/FeedbackCategoryListItem'
import { StyleSheet } from 'react-native'

type FeedbackMap = {
  [key in FeedbackCategory]: number
}

export default function FeedbackScreen() {
  const { driveRequest, reset } = useDriveRequestContext()
  const [feedbacks, setFeedbacks] = useState<FeedbackMap>(
    feedbackCategoryOptions.reduce(
      (acc, category) => ({
        ...acc,
        [category.value]: 0
      }),
      {} as FeedbackMap
    )
  )

  const handleSuccess = useCallback(() => {
    reset()
    router.replace('/')
  }, [reset])

  const { mutate: submitFeedback, isPending } = useMutation({
    mutationFn: driveRequestsApi.submitFeedback,
    onSuccess: handleSuccess
  })

  const handleRatingChange = useCallback(
    (category: FeedbackCategory, value: number) => {
      setFeedbacks((prev) => ({
        ...prev,
        [category]: value
      }))
    },
    [setFeedbacks]
  )

  const handleSubmitFeedback = useCallback(() => {
    if (!driveRequest) return
    submitFeedback({
      driveRequestId: driveRequest.id,
      data: Object.entries(feedbacks).map(([category, value]) => ({
        category: category as FeedbackCategory,
        rating: value
      }))
    })
  }, [driveRequest, submitFeedback, feedbacks])

  if (!driveRequest) return <Redirect href="/" />

  return (
    <>
      <Stack.Screen options={{ animation: 'slide_from_right' }} />
      <SafeAreaView style={styles.container}>
        <View row>
          <View flex row center>
            <TouchableOpacity
              br30
              style={styles.backButton}
              onPress={handleSuccess}
            >
              <Ionicons name="arrow-back-outline" size={24} color="gray" />
            </TouchableOpacity>
            <Text h4B>ให้คะแนนคนขับ</Text>
          </View>
        </View>
        <FlatList
          contentContainerStyle={styles.feedbackList}
          keyExtractor={(category) => category.value}
          data={feedbackCategoryOptions}
          renderItem={({ item: category }) => (
            <FeedbackCategoryListItem
              item={category}
              value={feedbacks[category.value]}
              onRatingChange={handleRatingChange}
            />
          )}
        />
        <Button
          secondary
          label="ตกลง"
          br10
          disabled={isPending}
          onPress={handleSubmitFeedback}
        />
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, backgroundColor: Colors.white },
  backButton: {
    position: 'absolute',
    left: 5,
    borderWidth: 1,
    padding: 7,
    borderColor: 'gray'
  },
  feedbackList: {
    flex: 1,
    justifyContent: 'center'
  }
})
