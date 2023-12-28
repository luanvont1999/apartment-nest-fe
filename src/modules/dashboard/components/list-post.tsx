import postService from '@/api/post'
import Pagination from '@/components/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { IPost, ListPagination } from '@/constants/types'
import { handleError } from '@/utils/helpers'
import { useRequest } from 'ahooks'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { DialogHeader } from '@/components/ui/dialog'
import QRCode from 'react-qr-code'

export default function ListPost() {
  const [posts, setPosts] = useState<ListPagination<IPost>>()
  const [target, setTarget] = useState<IPost | null>(null)
  const { runAsync: fetchPosts } = useRequest(postService.getPosts, {
    manual: true,
    onSuccess: (res) => {
      console.log(res)
      setPosts(res.data as ListPagination<IPost>)
    },
    onError: (err: Error | AxiosError) => {
      handleError(err)
    }
  })

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return (
    <div className='flex flex-col flex-1'>
      <div className='flex justify-between items-center mb-4'>
        <div>
          <Button>
            <Link to='./create'>Tạo bài viết</Link>
          </Button>
        </div>
      </div>
      <Table className='border bg-white rounded'>
        <TableHeader>
          <TableRow>
            <TableHead>
              <p className='font-bold'>Bài viết</p>
            </TableHead>
            <TableHead>Ngày đăng</TableHead>
            <TableHead>Lượt xem</TableHead>
            <TableHead>Lượt phản hồi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts?.data.map((item) => (
            <TableRow key={item.id} className='cursor-pointer' onClick={() => setTarget(item)}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{moment(item.createdAt).format('DD/MM/YYYY')}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {posts && <Pagination total={posts?.total} perPage={10} page={posts.page} className='mt-2' />}

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
                {target && <QRCode value={`https://apartment-nest-fe.vercel.app/question/${target.id}`} />}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
