import postService from '@/api/post'
import Pagination from '@/components/pagination'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IPost, ListPagination } from '@/constants/types'
import { handleError } from '@/utils/helpers'
import { useRequest } from 'ahooks'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<ListPagination<IPost>>()
  const [target, setTarget] = useState()
  const { runAsync: fetchPosts, loading: isLoading } = useRequest(postService.getPostsWithoutAuth, {
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

  const handleClickPost = (post: IPost) => {
    navigate('/question/' + post.id)
  }

  return (
    <div className='min-h-screen pt-8'>
      <div className='container'>
        <h1 className='text-4xl text-center font-extrabold mb-4'>Bảng thông báo SkyGarden</h1>
        <div className='flex flex-col gap-y-4'>
          {posts?.data.map((post) => (
            <Card className='cursor-pointer' onClick={() => handleClickPost(post)}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.createdAt}</CardDescription>
              </CardHeader>
              <CardContent>{post.content}</CardContent>
            </Card>
          ))}
        </div>

        {!isLoading && posts && (
          <Pagination page={posts?.page} perPage={posts?.perPage} total={posts?.total} className='mt-4' />
        )}
      </div>
    </div>
  )
}
