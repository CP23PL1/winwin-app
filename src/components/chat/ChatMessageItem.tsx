import { User } from '@/apis/users/type'
import moment from 'moment'
import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { Colors, View, Text } from 'react-native-ui-lib'

type Props = {
  user: User
  message: ChatMessage
}

export default function ChatMessageItem({ user, message }: Props) {
  const isMyMessage = useMemo(
    () => message.from === user.id,
    [message.from, user.id]
  )

  return (
    <View
      style={[
        {
          alignItems: isMyMessage ? 'flex-end' : 'flex-start',
          marginVertical: 5
        }
      ]}
    >
      <View
        paddingH-16
        paddingV-8
        br60
        backgroundColor={
          isMyMessage
            ? Colors.$backgroundPrimaryHeavy
            : Colors.rgba(222, 222, 222, 1)
        }
      >
        <Text
          style={styles.chatMessage}
          color={isMyMessage ? Colors.white : Colors.black}
        >
          {message.content}
        </Text>
      </View>
      <Text caption color="gray">
        {moment(message.timestamp).format('HH:mm')}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  chatMessage: {
    flexShrink: 1
  }
})
