import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom'
import AuthRoute from './AuthRoute'
import PrivateRoute from './PrivateRoute'
import LoginPage from '@/modules/login'
import PageNotFound from '@/modules/page-not-found'
import Dashboard from '@/modules/dashboard'
import BaseLayout from '@/layout/base'
import DashboardCreate from '@/modules/dashboard/create'
import QuestionDetail from '@/modules/home/detail'
import SuccessPage from '@/modules/home/success'
import DashboardDetail from '@/modules/dashboard/detail'
export const Routes = createBrowserRouter([
  { path: '/question/:id', element: <QuestionDetail /> },
  { path: '/success', element: <SuccessPage /> },
  {
    path: '/',
    element: (
      <AuthRoute>
        <Outlet />
      </AuthRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to='/login' replace />
      },
      {
        path: '/login',
        element: <LoginPage />
      }
    ]
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <BaseLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '/dashboard',

        children: [
          {
            index: true,
            element: <Dashboard />
          },
          {
            path: '/dashboard/create',
            element: <DashboardCreate />
          },
          {
            path: '/dashboard/:id',
            element: <DashboardDetail />
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
