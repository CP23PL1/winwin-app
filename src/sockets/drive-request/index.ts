import { auth0AuthCallback, socketManager } from '@/libs/socket-client'

export const driveRequestSocket = socketManager.socket('/drive-request', {
  auth: auth0AuthCallback
})
