import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, TextField, Button } from 'react-native-ui-lib'
import { Redirect, Stack } from 'expo-router'
import { Entypo } from '@expo/vector-icons'
import { useDriveRequestContext } from '@/contexts/DriveRequestContext'
import { driveRequestSocket } from '@/sockets/drive-request'

import ChatHeader from '@/components/chat/ChatHeader'
import ChatMessageList from '@/components/chat/ChatMessageList'

export default function DriveRequestChat() {
  const { driveRequest } = useDriveRequestContext()
  const [text, onChangeText] = useState('')
  const [messages, setChatMessages] = useState<ChatMessage[]>([])

  const sendChatMessage = (message: string) => {
    if (!driveRequest?.id) {
      console.log('No drive request id')
      return
    }
    if (!message) return
    const payload: ChatMessagePayload = {
      to: driveRequest.driver.id,
      message
    }
    driveRequestSocket.emit('chat-message', payload)
    setChatMessages((prev) => [
      ...prev,
      {
        from: driveRequest.user.id,
        to: driveRequest.driver.id,
        content: message,
        timestamp: new Date().toISOString()
      }
    ])
    onChangeText('')
  }

  const handleChatMessageReceived = useCallback((data: ChatMessage) => {
    setChatMessages((prev) => [...prev, data])
  }, [])

  useEffect(() => {
    driveRequestSocket.on('chat-message-received', handleChatMessageReceived)
    return () => {
      driveRequestSocket.off('chat-message-received', handleChatMessageReceived)
    }
  }, [handleChatMessageReceived])

  if (!driveRequest) {
    return <Redirect href="/" />
  }

  return (
    <View flex backgroundColor={'#F5F5F5'}>
      <Stack.Screen
        options={{
          header: () => (
            <ChatHeader
              title={`${driveRequest.driver.info.firstName} ${driveRequest.driver.info.lastName}`}
              description={`วินหมายเลข ${driveRequest.driver.info.no}`}
              image={driveRequest.driver.info.profileImage}
            />
          )
        }}
      />
      <ChatMessageList user={driveRequest.user} messages={messages} />
      <View row bg-white width={'100%'} paddingV-10>
        <View flex-1 center paddingH-15>
          <Button none>
            <Entypo name="image-inverted" size={35} color="#DEDEDE" />
          </Button>
        </View>
        <View flex-8 centerV>
          <TextField
            containerStyle={{
              borderColor: '#D5DDE0',
              borderWidth: 1,
              borderRadius: 30,
              paddingLeft: 13,
              paddingVertical: 10,
              backgroundColor: '#DEDEDE'
            }}
            placeholder="ข้อความ"
            onChangeText={onChangeText}
            value={text}
          />
        </View>
        <View flex-1 paddingL-5 paddingR-15 centerV>
          <Button
            none
            avoidMinWidth
            avoidInnerPadding
            onPress={() => sendChatMessage(text)}
          >
            <Text bodyB>ส่ง</Text>
          </Button>
        </View>
      </View>
    </View>
  )
}
