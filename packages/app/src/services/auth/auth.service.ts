import {
  ErrorResponseDto,
  RegisterUserDto,
  UserDto,
  UserResponse,
  ValidateUserDto
} from '@vnbp/common/dist/models'

import { useAuthStore } from '../../store/auth'
import { apiClient } from '../useAxios'

export default class AuthService {
  authStore = useAuthStore()

  async login(
    validateUser: ValidateUserDto
  ): Promise<UserResponse | ErrorResponseDto> {
    try {
      const { data } = await apiClient.post<UserResponse>(
        '/users/signin',
        validateUser
      )
      this.authStore.setAuthData(data)

      return data
    } catch ({ response: { data } }) {
      return data as ErrorResponseDto
    }
  }

  async register(
    createUser: RegisterUserDto
  ): Promise<UserResponse | ErrorResponseDto> {
    try {
      const { data } = await apiClient.post<UserResponse>('/users', createUser)
      this.authStore.setAuthData(data)

      return data
    } catch ({ response: { data } }) {
      return data as ErrorResponseDto
    }
  }

  async getCurrentUser(): Promise<UserDto | ErrorResponseDto> {
    try {
      const { data } = await apiClient.get<UserDto>('/users/user')

      return data
    } catch ({ response: { data } }) {
      return data as ErrorResponseDto
    }
  }

  async logout(): Promise<boolean> {
    const { data } = await apiClient.post('/users/logout')

    return data.success
  }
}
