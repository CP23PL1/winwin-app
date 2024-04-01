import { Coordinate } from '../shared/type'

export type ServiceSpot = {
  id: number
  name: string
  formattedAddress: string
  coords: Coordinate
  priceRateImageUrl: string
  serviceSpotOwner: Driver
  distance?: number
}

export type GetNearbyServiceSpotsParams = Coordinate & {
  radius: number
}
