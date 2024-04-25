import { FeedbackCategory } from '@/apis/drive-requests/types'

export type FeedbackCategoryOption = {
  value: FeedbackCategory
  label: string
}

export const feedbackCategoryOptions: FeedbackCategoryOption[] = [
  {
    value: 'manner',
    label: 'มารยาท'
  },
  {
    value: 'driving',
    label: 'การขับขี่'
  },
  {
    value: 'service',
    label: 'การบริการ'
  },
  {
    value: 'vehicle',
    label: 'ยานพาหนะ'
  }
] as const
