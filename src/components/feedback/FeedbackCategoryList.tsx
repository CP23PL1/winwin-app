import { FeedbackCategoryOption } from '@/constants/feedback'
import { FlatList } from 'react-native-gesture-handler'
import FeedbackCategoryListItem from './FeedbackCategoryListItem'
import { FeedbackCategory } from '@/apis/drive-requests/types'

type Props = {
  data: FeedbackCategoryOption[]
  onRatingChange: (category: FeedbackCategory, value: number) => void
}

export default function FeedbackCategoryList({ data, onRatingChange }: Props) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.value}
      renderItem={({ item }) => (
        <FeedbackCategoryListItem item={item} onRatingChange={onRatingChange} />
      )}
    />
  )
}
