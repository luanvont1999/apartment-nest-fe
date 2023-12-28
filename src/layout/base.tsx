import { Button } from '@/components/ui/button'
import { Building2, LogOut } from 'lucide-react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from './nav'

export default function BaseLayout() {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen flex flex-col border bg-secondary'>
      <div className='border-b-2 bg-white'>
        <div className='container'>
          <div className='flex h-16 justify-between items-center'>
            <div className='flex gap-x-6'>
              <div className='flex items-center gap-x-2 cursor-pointer' onClick={() => navigate('/')}>
                <Building2 className='w-8 h-8' />
                <h3 className='font-medium'>SkyGarden</h3>
              </div>

              <Navbar />
            </div>
            <div>
              <Button variant='outline' size='icon'>
                <LogOut />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className='flex-1 py-4'>
        <div className='container h-full'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
