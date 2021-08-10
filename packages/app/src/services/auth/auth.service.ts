import {
  CreateUserDto,
  ErrorResponseDto,
  UserDto,
  UserResponseDto,
  ValidateUserDto
} from '@vnbp/common/dist/models'

import { apiClient } from '../useAxios'

export default class AuthService {
  async login(
    validateUser: ValidateUserDto
  ): Promise<UserResponseDto | ErrorResponseDto> {
    try {
      const { data } = await apiClient.post('/users/signin', validateUser)

      return data as UserResponseDto
    } catch ({ response: { data } }) {
      return data as ErrorResponseDto
    }
  }

  async register(
    createUser: CreateUserDto
  ): Promise<UserResponseDto | ErrorResponseDto> {
    try {
      const { data } = await apiClient.post('/users', createUser)

      return data as UserResponseDto
    } catch ({ response: { data } }) {
      return data as ErrorResponseDto
    }
  }

  async getCurrentUser(): Promise<UserDto | ErrorResponseDto> {
    try {
      const { data } = await apiClient.get('/users/user')

      return data as UserDto
    } catch ({ response: { data } }) {
      return data as ErrorResponseDto
    }
  }

  async logout(): Promise<boolean> {
    const { data } = await apiClient.post('/users/logout')

    return data.success
  }
}
