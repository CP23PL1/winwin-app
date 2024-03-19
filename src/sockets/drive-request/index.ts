import { auth0AuthCallback, socketManager } from '@/libs/socket-client'

export const driveRequestsSocket = socketManager.socket('/drive-requests', {
  auth: auth0AuthCallback
})
