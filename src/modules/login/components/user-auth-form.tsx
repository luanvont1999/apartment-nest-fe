import { useRequest } from 'ahooks'
import { AxiosError } from 'axios'
import { FormEvent, useState } from 'react'
import { useDispatch } from 'react-redux'

import authService from '@/api/auth'
import { AuthResponse } from '@/api/types/auth'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { handleError, setLocalStorage } from '@/utils/helpers'
import { setUserInfo } from '@/store/reducers/user'
import { useNavigate } from 'react-router-dom'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    username: '',
    password: ''
  })

  const { runAsync: onLogin, loading: loginLoading } = useRequest(authService.login, {
    manual: true,
    onSuccess: (res) => {
      if (res?.data) {
        const data = res.data as AuthResponse
        if (data.user.role === 'admin') {
          setLocalStorage('token', {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
          })
          dispatch(setUserInfo(data.user))
          navigate('/dashboard')
        } else {
          // message.error('Account or password is incorrect')
        }
      }
    },
    onError: (err: Error | AxiosError) => {
      handleError(err)
    }
  })

  const handleChangeForm = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, name } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    onLogin(form)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className='grid gap-2'>
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='email'>
              Email
            </Label>
            <Input
              name='username'
              placeholder='Tên đăng nhập'
              type='text'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              value={form.username}
              disabled={loginLoading}
              onChange={handleChangeForm}
            />
            <Input
              name='password'
              placeholder='Mật khẩu'
              type='password'
              autoCapitalize='none'
              autoCorrect='off'
              value={form.password}
              disabled={loginLoading}
              onChange={handleChangeForm}
            />
          </div>
          <Button disabled={loginLoading}>
            {loginLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
            Đăng nhập
          </Button>
        </div>
      </form>
    </div>
  )
}
