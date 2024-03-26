declare type ChatMessage = {
  to: string
  from: string
  content: string
  timestamp: string
}

declare type ChatMessagePayload = Pick<ChatMessage, 'to', 'content'> & {
  driveRequestSid: string
}
