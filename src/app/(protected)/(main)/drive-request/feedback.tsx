import {
  View,
  Text,
  Image,
  Colors,
  GridList,
  Chip,
  Button,
  TouchableOpacity
} from 'react-native-ui-lib'
import { Ionicons } from '@expo/vector-icons'
import { useCallback, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDriveRequestContext } from '@/contexts/DriveRequestContext'
import { Redirect, Stack, router } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { driveRequestsApi } from '@/apis/drive-requests'
import { FeedbackCategory } from '@/apis/drive-requests/types'
import {
  FeedbackCategoryOptions,
  FeedbackOptions,
  feedbackCategoryOptions,
  feedbackOptions
} from '@/constants/feedback'

export default function FeedbackScreen() {
  const { driveRequest, reset } = useDriveRequestContext()
  const [rating, setRating] = useState<FeedbackOptions>(feedbackOptions[0])
  const [selectedCategories, setSelectedCategories] = useState<
    FeedbackCategoryOptions[]
  >([])

  const handleSuccess = useCallback(() => {
    reset()
    router.replace('/')
  }, [reset])

  const { mutate: submitFeedback, isPending } = useMutation({
    mutationFn: driveRequestsApi.submitFeedback,
    onSuccess: handleSuccess
  })

  const handleSelectCategory = useCallback(
    (category: FeedbackCategoryOptions) => {
      const newCategory = [...selectedCategories]
      const index = newCategory.findIndex((c) => c.value === category.value)
      if (index === -1) {
        setSelectedCategories([...newCategory, category])
        return
      }
      newCategory.splice(index, 1)
      setSelectedCategories(newCategory)
    },
    [selectedCategories, setSelectedCategories]
  )

  if (!driveRequest) return <Redirect href="/" />

  return (
    <>
      <Stack.Screen options={{ animation: 'slide_from_right' }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
        <View row padding-30>
          <View flex center>
            <TouchableOpacity
              absL
              br30
              style={{
                borderWidth: 1,
                padding: 7,
                borderColor: 'gray'
              }}
              onPress={handleSuccess}
            >
              <Ionicons name="arrow-back-outline" size={24} color="gray" />
            </TouchableOpacity>
            <Text h4B>ให้คะแนนคนขับ</Text>
          </View>
        </View>
        <View center>
          <Image
            width={200}
            height={300}
            resizeMode="contain"
            source={rating.image}
          />
          <View gap-20 center paddingB-25>
            <Text>การให้บริการเป็นอย่างไร?</Text>
            <View row gap-10>
              {feedbackOptions.map((r) => (
                <MaterialIcons
                  key={r.value}
                  name={r.value <= rating.value ? 'star' : 'star-border'}
                  size={48}
                  color={Colors.$backgroundPrimaryHeavy}
                  onPress={() => setRating(r)}
                />
              ))}
            </View>
          </View>
          <GridList
            style={{ marginTop: 20 }}
            listPadding={20}
            data={feedbackCategoryOptions}
            numColumns={2}
            renderItem={(category) => (
              <Chip
                borderRadius={10}
                center
                br40
                labelStyle={
                  selectedCategories.includes(category.item)
                    ? {
                        color: Colors.$backgroundPrimaryHeavy,
                        fontFamily: 'NotoSansThaiBold',
                        padding: 10
                      }
                    : {
                        color: Colors.grey30,
                        fontFamily: 'NotoSansThaiBold',
                        padding: 10
                      }
                }
                style={
                  selectedCategories.includes(category.item)
                    ? {
                        borderWidth: 1,
                        backgroundColor: Colors.$backgroundPrimaryLight,
                        borderColor: Colors.$backgroundPrimaryHeavy
                      }
                    : {
                        borderWidth: 1,
                        backgroundColor: Colors.white,
                        borderColor: Colors.grey50
                      }
                }
                label={category.item.label}
                size={{ width: 100, height: 40 }}
                onPress={() => handleSelectCategory(category.item)}
              />
            )}
          />
        </View>
        <View paddingH-20 paddingT-25>
          <Button
            secondary
            label="ตกลง"
            style={{ borderRadius: 10 }}
            disabled={isPending}
            onPress={() =>
              submitFeedback({
                driveRequestId: driveRequest.id!,
                category: selectedCategories.map(
                  (c) => c.value
                ) as FeedbackCategory[],
                rating: rating.value
              })
            }
          />
        </View>
      </SafeAreaView>
    </>
  )
}
