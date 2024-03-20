import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { MaskedPlaceDetail, Route } from '@/apis/google/type'
import { serviceSpotUtil } from '@/utils/service-spot'
import { useLocation } from '@/hooks/useLocation'
import { GeoPosition } from 'react-native-geolocation-service'
import Toast from 'react-native-toast-message'
import { router } from 'expo-router'
import { DriveRequest, RequestDrive } from '@/sockets/drive-request/type'
import { driveRequestSocket } from '@/sockets/drive-request'

type Props = {
  children: React.ReactNode
}

type DriveRequestContextT = {
  location: GeoPosition | null
  route: Route | null
  origin: MaskedPlaceDetail | null
  destination: MaskedPlaceDetail | null
  price: number
  driveRequest: DriveRequest | null
  setOrigin: (origin: MaskedPlaceDetail) => void
  setDestination: (destination: MaskedPlaceDetail) => void
  setRoute: (route: Route) => void
  requestDrive: () => void
}

const DriveRequestContext = createContext<DriveRequestContextT>(
  {} as DriveRequestContextT
)

export default function DriveRequestContextProvider({ children }: Props) {
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

  const requestDrive = useCallback(() => {
    if (!origin || !destination || !route) return
    const payload: RequestDrive = {
      origin,
      destination,
      route
    }
    driveRequestSocket.emit('request-drive', payload)
  }, [driveRequestSocket, origin, destination, route])

  const handleDriveRequestCreated = useCallback((data: DriveRequest) => {
    setDriveRequest(data)
    router.push('/drive-request')
  }, [])

  const handleDriveRequestRejected = useCallback(() => {
    Toast.show({
      type: 'info',
      text1: 'ขออภัย',
      text2: 'คำขอถูกปฏิเสธเนื่องจากไม่มีวินให้บริการในขณะนี้'
    })
  }, [])

  const handleException = useCallback((error: any) => {
    Toast.show({
      type: 'error',
      text1: 'เกิดข้อผิดพลาด',
      text2: error?.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'
    })
  }, [])

  // Handle socket io events on mount with cleanup
  useEffect(() => {
    driveRequestSocket.on('drive-request-created', handleDriveRequestCreated)
    driveRequestSocket.on('drive-request-rejected', handleDriveRequestRejected)
    driveRequestSocket.on('exception', handleException)

    return () => {
      driveRequestSocket.off('drive-request-created', handleDriveRequestCreated)
      driveRequestSocket.off(
        'drive-request-rejected',
        handleDriveRequestRejected
      )
      driveRequestSocket.off('exception', handleException)
    }
  }, [handleDriveRequestCreated, handleDriveRequestRejected, handleException])

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
        location,
        route,
        origin,
        destination,
        price,
        driveRequest,
        setOrigin,
        setDestination,
        setRoute,
        requestDrive
      }}
    >
      {children}
    </DriveRequestContext.Provider>
  )
}

export const useDriveRequestContext = () => {
  return useContext(DriveRequestContext)
}
