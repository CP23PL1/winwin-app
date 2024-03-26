import { Coordinate } from '../shared/type'

export type DriveRequestPreviewResponse = {
  duration: string
  distanceMeters: number
  polyline: {
    encodedPolyline: string
  }
  priceByDistance: number
  total: number
  serviceCharge: number
}

export type Waypoint = {
  name: string
  location: Coordinate
}
