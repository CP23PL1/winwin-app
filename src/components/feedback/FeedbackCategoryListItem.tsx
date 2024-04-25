import { FeedbackCategoryOption } from '@/constants/feedback'
import { Colors, Text, View } from 'react-native-ui-lib'
import RatingSelector from './RatingSelector'
import { FeedbackCategory } from '@/apis/drive-requests/types'
import { StyleSheet } from 'react-native'

type Props = {
  value: number
  item: FeedbackCategoryOption
  onRatingChange: (category: FeedbackCategory, value: number) => void
}

export default function FeedbackCategoryListItem({
  item,
  value,
  onRatingChange
}: Props) {
  return (
    <View style={styles.container}>
      <Text bodyB>{item.label}</Text>
      <RatingSelector
        max={5}
        value={value}
        onChange={(value) => onRatingChange(item.value, value)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.$backgroundGeneralLight,
    paddingVertical: 15
  }
})
