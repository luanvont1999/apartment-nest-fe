import axios, { AxiosError } from 'axios'
import { getLocalStorage, isTokenExpired, removeLocalStorage, setLocalStorage } from '@/utils/helpers'
import { ENV } from '@/constants'
import { AuthResponse } from './types/auth'
import authService from './auth'

export const api = axios.create({
  baseURL: ENV.baseUrlApi,
  timeout: 60000
})

api.interceptors.request.use(
  async (config) => {
    config.headers['Accept-Language'] = ENV.locale
    const data = getLocalStorage('token')

    if (data?.accessToken) {
      if (isTokenExpired(data?.accessToken)) {
        try {
          const res = await authService.refreshToken({
            refreshToken: data?.refreshToken ?? ''
          })
          if (res?.data) {
            const resRefresh: AuthResponse = res.data as AuthResponse
            config.headers.Authorization = `Bearer ${resRefresh.accessToken}`
            setLocalStorage('token', {
              accessToken: resRefresh.accessToken,
              refreshToken: resRefresh.refreshToken
            })
          }
        } catch (err) {
          removeLocalStorage('token')
          console.log('Login session has expired, Please login again!')
          setTimeout(() => {
            window.location.href = '/login'
          }, 1500)
          throw new Error('Unable to refresh access token.')
        }
      } else {
        config.headers.Authorization = `Bearer ${data?.accessToken}`
      }
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeLocalStorage('token')
      console.log('Login session timeout!')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
    }
    return Promise.reject(error)
  }
)
