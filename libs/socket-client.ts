import { Manager } from 'socket.io-client'

export const socketManager = new Manager(process.env.EXPO_PUBLIC_SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: false,
  upgrade: true
})
