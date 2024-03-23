import { auth0AuthCallback, socketManager } from '@/libs/socket-client'

export const driveRequestSocket = socketManager.socket('/drive-request', {
  auth: auth0AuthCallback
})

driveRequestSocket.onAny((...args) => {
  console.log('[Drive Request Socket]', 'event received', args)
})
