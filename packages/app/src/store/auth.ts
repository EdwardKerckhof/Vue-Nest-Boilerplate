import { UserDto, UserResponse } from '@vnbp/common/dist/models/index'
import { defineStore } from 'pinia'

import { jwtDecrypt } from '../helpers/jwtHelper'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    _authData: {
      accessToken: '',
      refreshToken: '',
      refreshTokenExp: '',
      tokenType: '',
      expiresIn: -1
    } as UserResponse,
    _currentUser: {
      id: -1,
      firstName: '',
      lastName: '',
      email: '',
      refreshTokenExp: ''
    } as UserDto
  }),
  getters: {
    authData(): UserResponse {
      return this._authData
    },
    currentUser(): UserDto {
      return this._currentUser
    }
  },
  actions: {
    setAuthData(data: UserResponse) {
      this._authData = data
      this.setCurrentUser(data.accessToken)
    },
    setCurrentUser(token: string) {
      const decodedJwt = jwtDecrypt(token)
      this._currentUser = JSON.parse(decodedJwt)
    }
  }
})
