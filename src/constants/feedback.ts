export const feedbackOptions = [
  {
    value: 1,
    label: 'แย่มาก',
    image: require(`../../assets/feedback/emoji_star_1.png`)
  },
  {
    value: 2,
    label: 'แย่',
    image: require(`../../assets/feedback/emoji_star_2.png`)
  },
  {
    value: 3,
    label: 'ปานกลาง',
    image: require(`../../assets/feedback/emoji_star_3.png`)
  },
  {
    value: 4,
    label: 'ดี',
    image: require(`../../assets/feedback/emoji_star_4.png`)
  },
  {
    value: 5,
    label: 'ดีมาก',
    image: require(`../../assets/feedback/emoji_star_5.png`)
  }
] as const

export type FeedbackOptions = (typeof feedbackOptions)[number]

export const feedbackCategoryOptions = [
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

export type FeedbackCategoryOptions = (typeof feedbackCategoryOptions)[number]
