export type Driver = {
  uid: string
  firstName: string
  lastName: string
  approved: boolean
  createdAt: string
  updatedAt: string
  serviceSpotId: number
  phoneNumber: string
  dateOfBirth: string
  nationalId: string
  vehicle: Vehicle
  no: number
  profileImage: string
}

export type Vehicle = {
  driverId: number
  id: number
  manufactor: string
  model: string
  plate: string
  province: string
  createAt: string
  updatedAt: string
}
