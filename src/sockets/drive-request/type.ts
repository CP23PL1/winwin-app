import {
  DriveRequestPreviewResponse,
  Waypoint
} from '@/apis/drive-requests/types'
import { Coordinate, Driver } from '@/apis/shared/type'
import { User } from '@/apis/users/type'

export enum DriveRequestSessionStatus {
  PENDING = 'pending',
  ON_GOING = 'on_going',
  ARRIVED = 'arrived',
  PICKED_UP = 'picked_up',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum DriveRequestStatus {
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export type RequestDrive = {
  origin: Coordinate
  destination: Coordinate
  route: DriveRequestPreviewResponse
}

export type DriveRequest = {
  sid?: string
  id: string
  userId: string
  driverId: string
  user: User
  driver: Driver
  origin: Waypoint
  destination: Waypoint
  route?: {
    duration: string
    distanceMeters: number
    polyline: {
      encodedPolyline: string
    }
  }
  total: number
  serviceCharge: number
  priceByDistance: number
  status: DriveRequestSessionStatus
  createdAt: string
}

export type DriveRequestDetail = {
  id: string
  userId: string
  driverId: string
  user: User
  driver: Driver
  origin: Waypoint
  destination: Waypoint
  route?: {
    duration: string
    distanceMeters: number
    polyline: {
      encodedPolyline: string
    }
  }
  paidAmount: number
  status: DriveRequestStatus
  createdAt: string
}
