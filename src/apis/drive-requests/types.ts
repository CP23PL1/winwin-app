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
  placeId?: string
}

export type CreateFeedback = {
  rating: number
  category: FeedbackCategory
}

export type FeedbackMap = {
  [key in FeedbackCategory]: number
}
