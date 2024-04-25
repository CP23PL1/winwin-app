import React, { useMemo } from 'react'
import { FlatList } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Colors, Text, View } from 'react-native-ui-lib'

type Props = {
  max: number
  value: number
  onChange: (value: number) => void
}

export default function RatingSelector({ max, value, onChange }: Props) {
  const data = useMemo(
    () => Array.from({ length: max }, (_, i) => i + 1),
    [max]
  )

  return (
    <FlatList
      data={data}
      contentContainerStyle={{ justifyContent: 'center', flex: 1 }}
      keyExtractor={(item) => item.toString()}
      renderItem={({ item: rating, index }) => (
        <View centerH>
          <MaterialIcons
            name={value >= rating ? 'star' : 'star-border'}
            size={58}
            color={Colors.$backgroundPrimaryHeavy}
            onPress={() => value <= max && onChange(rating)}
          />
          {index === 0 && <Text caption>แย่ที่สุด</Text>}
          {index === max - 1 && <Text caption>ดีที่สุด</Text>}
        </View>
      )}
      horizontal
    />
  )
}
