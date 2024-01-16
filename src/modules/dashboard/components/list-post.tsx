import { useRequest } from 'ahooks'
import { AxiosError } from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { Link, useNavigate } from 'react-router-dom'

import postService from '@/api/post'
import Pagination from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { IPost, ListPagination } from '@/constants/types'
import { handleError } from '@/utils/helpers'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/icons'
import clsx from 'clsx'
import { ENV } from '@/constants'

let debounce: NodeJS.Timeout

export default function ListPost() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<ListPagination<IPost>>()
  const [search, setSearch] = useState('')
  const [target, setTarget] = useState<IPost | null>(null)
  const { runAsync: fetchPosts, loading: isLoading } = useRequest(postService.getPosts, {
    manual: true,
    onSuccess: (res) => {
      setPosts(res.data as ListPagination<IPost>)
    },
    onError: (err: Error | AxiosError) => {
      handleError(err)
    }
  })
  const { runAsync: onDelete } = useRequest(postService.deletePost, {
    manual: true,
    onSuccess: () => {
      fetchPosts()
      toast('Xoá thành công')
    },
    onError: (err: Error | AxiosError) => {
      handleError(err)
    }
  })

  useEffect(() => {
    if (debounce) {
      clearTimeout(debounce)
    }
    setTimeout(() => {
      fetchPosts({ search: search ? search : undefined })
    }, 300)
  }, [fetchPosts, search])

  const handleChangePage = (value: number) => {
    fetchPosts({ page: value, perPage: posts?.perPage || 10 })
  }

  return (
    <div className='flex flex-col flex-1'>
      <div className='flex gap-2 justify-between items-center mb-4 flex-wrap'>
        <div className='flex-1 min-w-40 max-w-[400px] flex items-center gap-x-2'>
          <Input placeholder='Tìm kiếm tiêu đề' value={search} onChange={(event) => setSearch(event?.target.value)} />
          <Icons.spinner className={clsx('animate-spin', !isLoading && 'invisible')} />
        </div>
        <div>
          <Button>
            <Link to='./create'>Tạo bài viết</Link>
          </Button>
        </div>
      </div>
      <Table className='border bg-white rounded'>
        <TableHeader>
          <TableRow>
            <TableHead>Bài viết</TableHead>
            <TableHead className='w-40 text-center'>Ngày đăng</TableHead>
            <TableHead className='w-20' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts?.data.map((item) => (
            <TableRow key={item.id} className='cursor-pointer' onClick={() => navigate(`./${item.id}`)}>
              <TableCell>{item.title}</TableCell>
              <TableCell className='w-40 text-center'>{moment(item.createdAt).format('DD/MM/YYYY')}</TableCell>
              <TableCell className='w-20 text-right'>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={(event) => {
                    event.stopPropagation()
                    onDelete(item.id)
                  }}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {posts && <Pagination {...posts} className='mt-2' onChange={handleChangePage} />}

      <Dialog
        open={!!target}
        onOpenChange={(value) => {
          if (!value) setTarget(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-center'>
              <span className='text-2xl'>Tạo mã QR code</span>
            </DialogTitle>
            <DialogDescription>
              <div className='flex justify-center mt-8'>
                {target && <QRCode value={`${ENV.baseUrlApi}/question/${target.id}`} />}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
