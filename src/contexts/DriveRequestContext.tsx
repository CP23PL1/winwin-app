import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useLocation } from '@/hooks/useLocation'
import Toast from 'react-native-toast-message'
import { router } from 'expo-router'
import { DriveRequest, RequestDrive } from '@/sockets/drive-request/type'
import { driveRequestSocket } from '@/sockets/drive-request'
import {
  DriveRequestPreviewResponse,
  Waypoint
} from '@/apis/drive-requests/types'
import { LatLng } from 'react-native-maps'
import { mapUtil } from '@/utils/map'
import { LocationObject } from 'expo-location'

type Props = {
  readonly children: React.ReactNode
}

type DriveRequestContextT = {
  location: LocationObject | null
  points: LatLng[]
  route: DriveRequestPreviewResponse | null
  origin: Waypoint | null
  destination: Waypoint | null
  driveRequest: DriveRequest | null
  isRequesting: boolean
  hasNewChatMessage: boolean
  setHasNewChatMessage: (hasNewMessage: boolean) => void
  setOrigin: (origin: Waypoint) => void
  setDestination: (destination: Waypoint) => void
  setRoute: (route: DriveRequestPreviewResponse) => void
  requestDrive: () => void
  reset: () => void
}

const DriveRequestContext = createContext<DriveRequestContextT>(
  {} as DriveRequestContextT
)

export default function DriveRequestContextProvider({ children }: Props) {
  const { location } = useLocation()
  const [route, setRoute] = useState<DriveRequestPreviewResponse | null>(null)
  const [origin, setOrigin] = useState<Waypoint | null>(null)
  const [destination, setDestination] = useState<Waypoint | null>(null)
  const [driveRequest, setDriveRequest] = useState<DriveRequest | null>(null)
  const [isRequesting, setIsRequesting] = useState(false)
  const [hasNewChatMessage, setHasNewChatMessage] = useState(false)

  const points = useMemo(() => {
    if (!route) return []
    return mapUtil.decodePolyline(route.polyline.encodedPolyline)
  }, [route])

  const requestDrive = useCallback(() => {
    if (!origin || !destination || !route) return
    const payload: RequestDrive = {
      origin: origin.location,
      destination: destination.location,
      route
    }
    driveRequestSocket.emit('request-drive', payload)
    setIsRequesting(true)
  }, [driveRequestSocket, origin, destination, route])

  const reset = useCallback(() => {
    setRoute(null)
    setDriveRequest(null)
    setIsRequesting(false)
    setOrigin(null)
    setDestination(null)
  }, [setDriveRequest, setIsRequesting, setRoute, setOrigin, setDestination])

  const handleDriveRequestCreated = useCallback(
    (data: DriveRequest) => {
      setDriveRequest(data)
      if (data.origin && data.destination) {
        setOrigin(data.origin)
        setDestination(data.destination)
      }
      setIsRequesting(false)
    },
    [setOrigin, setDestination, setIsRequesting, setDriveRequest]
  )

  const handleDriveRequestUpdated = useCallback(
    (data: Partial<DriveRequest>) => {
      if (!driveRequest) return
      setDriveRequest({ ...driveRequest, ...data })
    },
    [driveRequest]
  )

  const handleDriveRequestRejected = useCallback(() => {
    Toast.show({
      type: 'info',
      text1: 'ขออภัย',
      text2: 'คำขอถูกปฏิเสธเนื่องจากไม่มีวินให้บริการในขณะนี้'
    })
    setDriveRequest(null)
    setIsRequesting(false)
  }, [])

  const handleDriveRequestCompleted = useCallback(() => {
    Toast.show({
      type: 'success',
      text1: 'เดินทางสำเร็จ',
      text2: 'ขอบคุณที่ใช้บริการของเรา',
      visibilityTime: 6000
    })
    router.replace('/drive-request/feedback')
  }, [])

  const handleChatMessageReceived = useCallback(() => {
    setHasNewChatMessage(true)
  }, [])

  const handleException = useCallback(
    (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'เกิดข้อผิดพลาด',
        text2: error?.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'
      })
      setIsRequesting(false)
    },
    [reset]
  )

  // Handle socket io events on mount with cleanup
  useEffect(() => {
    driveRequestSocket.on('drive-request-created', handleDriveRequestCreated)
    driveRequestSocket.on('drive-request-updated', handleDriveRequestUpdated)
    driveRequestSocket.on('drive-request-rejected', handleDriveRequestRejected)
    driveRequestSocket.on(
      'drive-request-completed',
      handleDriveRequestCompleted
    )
    driveRequestSocket.on('chat-message-received', handleChatMessageReceived)
    driveRequestSocket.on('exception', handleException)

    return () => {
      driveRequestSocket.off('drive-request-created', handleDriveRequestCreated)
      driveRequestSocket.off('drive-request-updated', handleDriveRequestUpdated)
      driveRequestSocket.off(
        'drive-request-rejected',
        handleDriveRequestRejected
      )
      driveRequestSocket.off(
        'drive-request-completed',
        handleDriveRequestCompleted
      )
      driveRequestSocket.off('chat-message-received', handleChatMessageReceived)
      driveRequestSocket.off('exception', handleException)
    }
  }, [
    handleDriveRequestCreated,
    handleDriveRequestUpdated,
    handleDriveRequestRejected,
    handleDriveRequestCompleted,
    setDriveRequest,
    handleException
  ])

  // Handle socket io connection on mount with cleanup
  useEffect(() => {
    driveRequestSocket.connect()

    return () => {
      driveRequestSocket.disconnect()
    }
  }, [])

  return (
    <DriveRequestContext.Provider
      value={{
        points,
        isRequesting,
        location,
        route,
        origin,
        destination,
        driveRequest,
        hasNewChatMessage,
        setHasNewChatMessage,
        setOrigin,
        setDestination,
        setRoute,
        requestDrive,
        reset
      }}
    >
      {children}
    </DriveRequestContext.Provider>
  )
}

export const useDriveRequestContext = () => {
  return useContext(DriveRequestContext)
}
