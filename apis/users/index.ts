import { User } from 'react-native-auth0'
import axiosInstance from '../../libs/axios'
import { CreateUser, UserIdentificationType } from './type'

class UsersApi {
  async getUserBy(
    identifier: string | number,
    identify_by: UserIdentificationType
  ) {
    return axiosInstance<User>(`/users/${identifier}`, {
      params: {
        identify_by
      }
    }).then((res) => res.data)
  }

  async getMyUserInfo() {
    return axiosInstance<User>('/users/me').then((res) => res.data)
  }

  async createUser(user: CreateUser) {
    return axiosInstance.post<User>('/users', user).then((res) => res.data)
  }
}

export const usersApi = new UsersApi()
