import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { MaskedPlaceDetail, Route } from '../apis/google/type'
import { serviceSpotUtil } from '../utils/service-spot'
import { Coordinate } from '../apis/shared/type'
import { User } from '../apis/users/type'
import { auth0AuthCallback, socketManager } from '../libs/socket-client'
import { useLocation } from '../hooks/useLocation'
import { GeoPosition } from 'react-native-geolocation-service'
import Toast from 'react-native-toast-message'
import { router } from 'expo-router'

export type CreateDriveRequest = {
  origin: Coordinate
  destination: Coordinate
}

export enum DriveRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  PICKED_UP = 'picked_up',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export type RequestDrive = {
  origin: MaskedPlaceDetail
  destination: MaskedPlaceDetail
  route: Route
}

export type DriveRequest = {
  id?: number
  user: User
  driver?: any
  origin: Coordinate
  destination: Coordinate
  status?: DriveRequestStatus
  refCode?: string
  createdAt?: string
  updatedAt?: string
  route: Route
}

type DriveRequestContextT = {
  location: GeoPosition | null
  route: Route | null
  origin: MaskedPlaceDetail | null
  destination: MaskedPlaceDetail | null
  price: number
  setOrigin: (origin: MaskedPlaceDetail) => void
  setDestination: (destination: MaskedPlaceDetail) => void
  setRoute: (route: Route) => void
  driveRequest: DriveRequest | null
  createDriveRequest: () => Promise<void>
  sendChatMessage: (message: string) => void
}

const DriveRequestContext = createContext<DriveRequestContextT>(
  {} as DriveRequestContextT
)

export const useDriveRequestContext = () => {
  return useContext(DriveRequestContext)
}

const driveRequestsSocket = socketManager.socket('/drive-requests', {
  auth: auth0AuthCallback
})

export default function DriveRequestContextProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { location } = useLocation()
  const [route, setRoute] = useState<Route | null>(null)
  const [origin, setOrigin] = useState<MaskedPlaceDetail | null>(null)
  const [destination, setDestination] = useState<MaskedPlaceDetail | null>(null)
  const [driveRequest, setDriveRequest] = useState<DriveRequest | null>(null)

  const price = useMemo(
    () =>
      route?.distanceMeters
        ? serviceSpotUtil.calculatePrice(route.distanceMeters / 1000)
        : 0,
    [route?.distanceMeters]
  )

  const createDriveRequest = useCallback(async () => {
    if (!origin || !destination || !route) return
    const payload: RequestDrive = {
      origin,
      destination,
      route
    }
    driveRequestsSocket.emit('request-drive', payload)
  }, [driveRequestsSocket, origin, destination, route])

  const sendChatMessage = useCallback(
    (message: string) => {
      if (!driveRequest) return
      driveRequestsSocket.emit('drive-requests:chat', {
        driveRequestId: driveRequest.id,
        message
      })
    },
    [driveRequest]
  )

  const handleDriveRequested = (data: DriveRequest) => {
    router.push('/drive-requests')
    setDriveRequest(data)
  }

  const handleDriveRequestChat = (data: any) => {
    console.log(data)
  }

  const handleDriveRequestRejected = useCallback(() => {
    createDriveRequest()
  }, [driveRequest, origin, destination, route])

  useEffect(() => {
    driveRequestsSocket.connect()

    return () => {
      driveRequestsSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    const handleException = (data: any) => {
      Toast.show({
        type: 'error',
        text1: 'เกิดข้อผิดพลาด',
        text2: data.message
      })
    }

    driveRequestsSocket.on('drive-requested', handleDriveRequested)
    driveRequestsSocket.on('drive-requests:chat', handleDriveRequestChat)
    driveRequestsSocket.on('drive-request-rejected', handleDriveRequestRejected)
    driveRequestsSocket.on('exception', handleException)

    return () => {
      driveRequestsSocket.off('drive-requested', handleDriveRequested)
      driveRequestsSocket.off('exception', handleException)
    }
  }, [handleDriveRequestRejected])

  return (
    <DriveRequestContext.Provider
      value={{
        location,
        route,
        origin,
        destination,
        price,
        setOrigin,
        setDestination,
        setRoute,
        driveRequest,
        createDriveRequest,
        sendChatMessage
      }}
    >
      {children}
    </DriveRequestContext.Provider>
  )
}
