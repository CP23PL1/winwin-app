import { Driver } from '../drivers/type'
import { Coordinate, SubDistrict } from '../shared/type'

export type ServiceSpot = {
  id: number
  name: string
  placeId: string
  addressLine1: string
  addressLine2?: string
  address: SubDistrict
  coords: Coordinate
  priceRateImageUrl: string
  serviceSpotOwner: Driver
  distance?: number
}

export type GetNearbyServiceSpotsParams = Coordinate & {
  radius: number
}
