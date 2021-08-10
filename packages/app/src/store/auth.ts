import { UserDto } from '@vnbp/common/dist/models/index'
import { defineStore } from 'pinia'

import { jwtDecrypt, tokenAlive } from '../helpers/jwtHelper'
import { setLocal } from '../services/useLocalStorage'

export interface AuthData {
  accessToken: string
  refreshToken: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    _authData: {
      accessToken: '',
      refreshToken: ''
    } as AuthData,
    _currentUser: {
      id: -1,
      firstName: '',
      lastName: '',
      email: '',
      refreshTokenExp: ''
    } as UserDto,
    _allUsers: [] as UserDto[]
  }),
  getters: {
    authData(): AuthData {
      return this._authData
    },
    currentUser(): UserDto {
      return this._currentUser
    },
    tokenAlive(): boolean {
      const refreshTokenExp = this._currentUser.refreshTokenExp
      if (!refreshTokenExp) return false

      return tokenAlive(refreshTokenExp)
    },
    allUsers(): UserDto[] {
      return this._allUsers
    }
  },
  actions: {
    setAuthData(data: AuthData) {
      setLocal('vnbp_jwt', data.accessToken)
      setLocal('vnbp_refresh_token', data.refreshToken)
      this._authData = data

      const user = jwtDecrypt(data.accessToken)

      this.setCurrentUser(JSON.parse(user))
    },
    setCurrentUser(user: UserDto) {
      this._currentUser = user
    },
    setAllUsers(users: UserDto[]) {
      this._allUsers = users
    }
  }
})
