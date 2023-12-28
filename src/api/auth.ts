import axios from 'axios'
import { api } from '.'
import { ENV } from '@/constants'
import { AuthRequest } from './types/auth'

const login = (data: AuthRequest) => api.post('/auth/login', data)
const logout = () => api.delete('/auth/logout')

const getMe = () => api.get('auth/me')

const refreshToken = ({ refreshToken }: { refreshToken: string }) =>
  axios.post(`${ENV.baseUrlApi}/auth/token`, {
    refreshToken
  })

const authService = {
  login,
  logout,
  getMe,
  refreshToken
}

export default authService
