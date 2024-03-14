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

export type DriveRequest = {
  id: number
  user: User
  driver: any
  origin: Coordinate
  destination: Coordinate
  status: DriveRequestStatus
  refCode: string
  createdAt: string
  updatedAt: string
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
    if (!driveRequestsSocket.connected) {
      driveRequestsSocket.connect()
    }
    const newDriveRequest = await driveRequestsSocket.emitWithAck(
      'drive-requests:create',
      {
        origin,
        destination,
        route
      }
    )
    setDriveRequest(newDriveRequest)
  }, [driveRequestsSocket, origin, destination, route])

  useEffect(() => {
    const handleException = (data: any) => {
      console.error(data)
    }

    const handleDriveRequestUpdated = (driveRequest: DriveRequest) => {
      console.log(driveRequest)
      setDriveRequest((prev) => ({
        ...prev,
        ...driveRequest
      }))
    }

    driveRequestsSocket.on('drive-requests:updated', handleDriveRequestUpdated)
    driveRequestsSocket.on('exception', handleException)

    return () => {
      driveRequestsSocket.off(
        'drive-requests:updated',
        handleDriveRequestUpdated
      )
      driveRequestsSocket.off('exception', handleException)
    }
  }, [])

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
        createDriveRequest
      }}
    >
      {children}
    </DriveRequestContext.Provider>
  )
}
