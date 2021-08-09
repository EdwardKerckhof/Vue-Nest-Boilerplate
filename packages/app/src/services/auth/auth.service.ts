import {
  ErrorResponseDto,
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
}
