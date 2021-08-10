import { CookieData } from '@vnbp/common/dist/models'
import axios, { AxiosInstance } from 'axios'

import { useAuthStore } from '../store/auth'

export const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-type': 'application/json'
  },
  withCredentials: true
})

apiClient.interceptors.request.use(
  (req) => {
    const authStore = useAuthStore()
    const isAuthenticated = authStore.tokenAlive
    const authData = authStore.authData

    if (isAuthenticated) {
      req.headers.common['Authorization'] = `bearer ${authData.accessToken}`
    }
    return req
  },
  (err) => {
    return Promise.reject(err)
  }
)

apiClient.interceptors.response.use(
  (res) => {
    return res
  },
  async (error) => {
    const originalConfig = error.config

    if (originalConfig.url !== '/users/signin' && error.response) {
      // AccessToken is expired, try refreshing with refresh token
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true
        const authStore = useAuthStore()

        try {
          const { data } = await apiClient.get<CookieData>('/users/refresh')

          const accessToken = data.token
          const refreshToken = data.refreshToken

          authStore.setAuthData({ accessToken, refreshToken })

          return apiClient(originalConfig)
        } catch (_error) {
          return Promise.reject(_error)
        }
      }
    }

    return Promise.reject(error)
  }
)
