import { ServiceSpot } from '../service-spots/type'

export type Coordinate = {
  lat: number
  lng: number
}

export type Address = {
  id: number
  nameTH: string
  nameEN: string
}

export type SubDistrict = Address & {
  district: District
}

export type District = Address & {
  province: Province
}

export type Province = Address

export type Paginate<T> = {
  data: T[]
  links: {
    current: string
    last: string
    next: string
  }
  meta: {
    currentPage: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
  }
}

export type PaginateParams = Partial<{
  page: number
  limit: number
  sortBy: string
  search: string
  searchBy: string
}>

export type Driver = {
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

export type Vehicle = {
  id: number
  plate: string
  province: string
  model: string
  manufactor: string
}
