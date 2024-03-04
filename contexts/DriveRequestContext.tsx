import { createContext, useContext, useState } from 'react'
import { MaskedPlaceDetail, Route } from '../apis/google/type'

type DriveRequestContextT = {
  route: Route | null
  origin: MaskedPlaceDetail | null
  destination: MaskedPlaceDetail | null
  setOrigin: (origin: MaskedPlaceDetail) => void
  setDestination: (destination: MaskedPlaceDetail) => void
  setRoute: (route: Route) => void
}

const DriveRequestContext = createContext<DriveRequestContextT>(
  {} as DriveRequestContextT
)

export const useDriveRequestContext = () => {
  return useContext(DriveRequestContext)
}

export default function DriveRequestContextProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [route, setRoute] = useState<any>(null)
  const [origin, setOrigin] = useState<MaskedPlaceDetail | null>(null)
  const [destination, setDestination] = useState<MaskedPlaceDetail | null>(null)

  return (
    <DriveRequestContext.Provider
      value={{
        route,
        origin,
        destination,
        setOrigin,
        setDestination,
        setRoute
      }}
    >
      {children}
    </DriveRequestContext.Provider>
  )
}
