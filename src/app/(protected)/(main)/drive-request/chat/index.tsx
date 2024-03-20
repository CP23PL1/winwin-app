import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  TextField,
  Button,
  Colors,
  Image
} from 'react-native-ui-lib'
import { Redirect, Stack, router, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'
import { useDriveRequestContext } from '@/contexts/DriveRequestContext'
import { FlatList } from 'react-native-gesture-handler'
import { driveRequestSocket } from '@/sockets/drive-request'
import moment from 'moment'
import { SafeAreaView } from 'react-native-safe-area-context'

type IncomingChatPayload = {
  sender: string
  message: string
  timestamp: Date
}

type ChatPayload = {
  to: string
  message: string
}

export default function DriveRequestChat() {
  const { driveRequest } = useDriveRequestContext()
  const [text, onChangeText] = useState('')
  const [chatMessages, setChatMessages] = useState<IncomingChatPayload[]>([])

  const sendChatMessage = (message: string) => {
    if (!driveRequest?.id) {
      console.log('No drive request id')
      return
    }
    if (!message) return

    const payload: ChatPayload = {
      to: driveRequest.user.id,
      message
    }
    driveRequestSocket.emit('chat-message', payload)
    onChangeText('')
  }

  const handleChatMessageReceived = useCallback((data: IncomingChatPayload) => {
    console.log('Chat message received', data)
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
            <SafeAreaView
              style={{
                backgroundColor: 'white',
                elevation: 10,
                padding: 20
              }}
            >
              <View row gap-10>
                <Button
                  none
                  avoidMinWidth
                  avoidInnerPadding
                  onPress={router.back}
                >
                  <Ionicons name="arrow-back" size={24} color={Colors.black} />
                </Button>
                <View row gap-10 centerV>
                  <Image
                    src={driveRequest.driver.info.profileImage}
                    style={{ width: 40, height: 40, borderRadius: 40 }}
                  />
                  <View>
                    <Text h5B>
                      {driveRequest.driver.info.firstName}{' '}
                      {driveRequest.driver.info.lastName}
                    </Text>
                    <Text caption>
                      วินหมายเลข {driveRequest.driver.info.no}
                    </Text>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          )
        }}
      />
      <FlatList
        style={styles.chatContainer}
        data={chatMessages}
        renderItem={(chatItem) => (
          <View
            style={[
              {
                alignItems:
                  chatItem.item.sender === driveRequest.user.id
                    ? 'flex-end'
                    : 'flex-start',
                marginVertical: 5
              }
            ]}
          >
            <View
              paddingH-16
              paddingV-8
              br60
              backgroundColor={
                chatItem.item.sender === driveRequest.user.id
                  ? Colors.$backgroundPrimaryHeavy
                  : Colors.rgba(222, 222, 222, 1)
              }
            >
              <Text
                style={styles.chatMessage}
                color={
                  chatItem.item.sender === driveRequest.user.id
                    ? Colors.white
                    : Colors.black
                }
              >
                {chatItem.item.message}
              </Text>
            </View>
            <Text caption color="gray">
              {moment(chatItem.item.timestamp).format('HH:mm')}
            </Text>
          </View>
        )}
      />
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

const styles = StyleSheet.create({
  chatContainer: {
    flexGrow: 1,
    padding: 15
  },

  chatMessage: {
    flexShrink: 1
  },
  sender: {
    backgroundColor: Colors.$backgroundPrimaryHeavy
  },
  receiver: {
    backgroundColor: Colors.rgba(222, 222, 222, 1)
  }
})
