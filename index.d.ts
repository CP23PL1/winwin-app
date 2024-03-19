declare type WsAck<T = any> = {
  success: boolean
  message: string
  data: T
}
