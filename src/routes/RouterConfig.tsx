import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom'
import AuthRoute from './AuthRoute'
import PrivateRoute from './PrivateRoute'
import LoginPage from '@/modules/login'
import PageNotFound from '@/modules/page-not-found'
import Dashboard from '@/modules/dashboard'
import BaseLayout from '@/layout/base'
import DashboardCreate from '@/modules/dashboard/create'
import HomePage from '@/modules/home'
import QuestionDetail from '@/modules/home/detail'
export const Routes = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        element: <HomePage />
      },
      { path: '/question/:id', element: <QuestionDetail /> }
    ]
  },

  {
    path: '/admin',
    element: (
      <AuthRoute>
        <Outlet />
      </AuthRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to='/admin/login' replace />
      },
      {
        path: '/admin/login',
        element: <LoginPage />
      }
    ]
  },
  {
    path: '/admin',
    element: (
      <PrivateRoute>
        <BaseLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '/admin/dashboard',

        children: [
          {
            index: true,
            element: <Dashboard />
          },
          {
            path: '/admin/dashboard/create',
            element: <DashboardCreate />
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <PageNotFound />
  }
])
