import { MaskedPlaceDetail, Route } from '@/apis/google/type'
import { Coordinate } from '@/apis/shared/type'
import { User } from '@/apis/users/type'

export type CreateDriveRequest = {
  origin: Coordinate
  destination: Coordinate
}

export enum DriveRequestStatus {
  PENDING = 'pending',
  ON_GOING = 'on_going',
  ARRIVED = 'arrived',
  PICKED_UP = 'picked_up',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export type RequestDrive = {
  origin: MaskedPlaceDetail
  destination: MaskedPlaceDetail
  route: Route
}

export type DriveRequest = {
  sid?: string
  user_id?: string
  driver_id?: string
  user: User
  driver: Driver
  origin?: Coordinate
  destination?: Coordinate
  route?: {
    duration: string
    distanceMeters: number
    polyline: {
      encodedPolyline: string
    }
  }
  status?: DriveRequestStatus
  refCode?: string
  createdAt?: string
}
