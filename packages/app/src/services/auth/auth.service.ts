import {
  ErrorResponseDto,
  RegisterUserDto,
  UserDto,
  ValidateUserDto,
  ValidationResponse
} from '@vnbp/common/dist/models'

import { useAuthStore } from '../../store/auth'
import { apiClient } from '../useAxios'
import { clearLocal } from '../useLocalStorage'

export default class AuthService {
  authStore = useAuthStore()

  async login(
    validateUser: ValidateUserDto
  ): Promise<ValidationResponse | ErrorResponseDto> {
    try {
      const { data } = await apiClient.post<ValidationResponse>(
        '/users/signin',
        validateUser
      )
      this.authStore.setAuthData(data)

      this.getCurrentUser()

      return data
    } catch ({ response: { data } }) {
      return data as ErrorResponseDto
    }
  }

  async register(
    createUser: RegisterUserDto
  ): Promise<ValidationResponse | ErrorResponseDto> {
    try {
      const { data } = await apiClient.post<ValidationResponse>(
        '/users',
        createUser
      )
      this.authStore.setAuthData(data)

      this.getCurrentUser()

      return data
    } catch ({ response: { data } }) {
      return data as ErrorResponseDto
    }
  }

  private async getCurrentUser(): Promise<UserDto | ErrorResponseDto> {
    try {
      const { data } = await apiClient.get<UserDto>('/users/user')

      this.authStore.setCurrentUser(data)

      return data
    } catch ({ response: { data } }) {
      return data as ErrorResponseDto
    }
  }

  async logout(): Promise<boolean> {
    const { data } = await apiClient.post('/users/logout')

    if (data.success) {
      this.authStore.$reset()
      clearLocal()
    }

    return data.success
  }

  async getAllUsers(): Promise<UserDto[] | ErrorResponseDto> {
    try {
      const { data } = await apiClient.get<UserDto[]>('/users')

      this.authStore.setAllUsers(data)

      return data
    } catch ({ response }) {
      return response as ErrorResponseDto
    }
  }
}
