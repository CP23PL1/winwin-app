export enum UserIdentificationType {
  ID = 'id',
  EMAIL = 'email',
  PHONE_NUMBER = 'phoneNumber'
}

export type User = {
  id: number
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  createdAt: string
  updatedAt: string
}

export type CreateUser = {
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
}
