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

export default function ListPost() {
  const [posts, setPosts] = useState<ListPagination<IPost>>()
  const { runAsync: fetchPosts, loading: isLoading } = useRequest(postService.getPosts, {
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
            <TableHead>Bài viết</TableHead>
            <TableHead>Ngày đăng</TableHead>
            <TableHead>Lượt xem</TableHead>
            <TableHead>Lượt phản hồi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts?.data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.createdAt}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {posts && <Pagination total={posts?.total} perPage={10} page={posts.page} className='mt-2' />}
    </div>
  )
}
