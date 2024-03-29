import { Coordinate } from '../shared/type'

export type FeedbackCategory = 'manner' | 'vehicle' | 'service' | 'driving'

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

export type CreateFeedback = {
  driveRequestId: string
  rating: number
  category: FeedbackCategory[]
}
