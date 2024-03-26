import { Manager } from 'socket.io-client'
import auth0 from './auth0'

export const socketManager = new Manager(process.env.EXPO_PUBLIC_SOCKET_URL, {
  autoConnect: false,
  path: process.env.EXPO_PUBLIC_SOCKET_PATH
})

export const auth0AuthCallback = async (cb: (obj: object) => void) => {
  const credentials = await auth0.credentialsManager.getCredentials()
  if (!credentials.accessToken) {
    throw new Error('No access token')
  }
  cb({
    accessToken: credentials.accessToken
  })
}
