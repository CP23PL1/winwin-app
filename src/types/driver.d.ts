declare type Driver = {
  id: string
  phoneNumber: string
  serviceSpot: ServiceSpot
  createdAt: Date
  updatedAt: Date
  info: {
    id: number
    nationalId: string
    firstName: string
    lastName: string
    phoneNumber: string
    dateOfBirth: string
    createdAt: string
    updatedAt: string
    profileImage: string
    no: string
    vehicle: Vehicle
  }
}

declare type Vehicle = {
  id: number
  plate: string
  province: string
  model: string
  manufactor: string
}
