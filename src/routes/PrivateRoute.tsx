import React from 'react'
import { Navigate } from 'react-router-dom'
import { getLocalStorage } from '@/utils/helpers'

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = getLocalStorage('token')
  if (!token) {
    return <Navigate replace to='/login' />
  }

  return children
}
