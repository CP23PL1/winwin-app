import React, { useCallback, useEffect, useState } from 'react'
import { View, TextField, Colors } from 'react-native-ui-lib'
import { Redirect, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useDriveRequestContext } from '@/contexts/DriveRequestContext'
import { driveRequestSocket } from '@/sockets/drive-request'

import ChatHeader from '@/components/chat/ChatHeader'
import ChatMessageList from '@/components/chat/ChatMessageList'
import { TouchableOpacity } from 'react-native'

export default function DriveRequestChat() {
  const { driveRequest, setHasNewChatMessage } = useDriveRequestContext()
  const [text, onChangeText] = useState('')
  const [messages, setChatMessages] = useState<ChatMessage[]>([])

  const sendChatMessage = (message: string) => {
    if (!driveRequest?.sid) {
      console.log('No drive request id')
      return
    }
    if (!message) return
    const payload: ChatMessagePayload = {
      driveRequestSid: driveRequest.sid,
      to: driveRequest.driverId,
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
    setHasNewChatMessage(true)
  }, [])

  useEffect(() => {
    driveRequestSocket.on('chat-message-received', handleChatMessageReceived)
    return () => {
      driveRequestSocket.off('chat-message-received', handleChatMessageReceived)
    }
  }, [handleChatMessageReceived])

  useEffect(() => {
    if (!driveRequest) return
    driveRequestSocket
      .emitWithAck('get-chat-messages', driveRequest.sid)
      .then((data) => {
        setChatMessages(data)
      })
  }, [driveRequest, setChatMessages])

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
      <View row bg-white padding-10 center>
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
        <View centerV paddingH-15>
          <Ionicons
            name="send"
            size={24}
            style={{ opacity: text ? 1 : 0.5 }}
            color={text ? Colors.$iconPrimary : Colors.$iconNeutral}
            onPress={() => sendChatMessage(text)}
            disabled={!text}
          />
        </View>
      </View>
    </View>
  )
}
