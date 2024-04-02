import axiosInstance from '@/libs/axios'
import { CreateUser, User, UserIdentificationType } from './type'
import { Paginate, PaginateParams } from '../shared/type'
import { DriveRequest } from '@/sockets/drive-request/type'

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

  async getMyDriveRequests(params?: PaginateParams) {
    return axiosInstance<Paginate<DriveRequest>>('/users/me/drive-requests', {
      params
    }).then((res) => res.data)
  }

  async getMyDriveRequestById(id: string) {
    return axiosInstance
      .get<DriveRequest>(`/users/me/drive-requests/${id}`)
      .then((res) => res.data)
  }
}

export const usersApi = new UsersApi()
