import postService from '@/api/post'
import { IPost } from '@/constants/types'
import { handleError } from '@/utils/helpers'
import { useRequest } from 'ahooks'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import AnswerForm from './components/answer-form'

export default function QuestionDetail() {
  const { id } = useParams()

  const [post, setPost] = useState<IPost>()

  const { runAsync: fetchPost } = useRequest(postService.getPostByIdWithoutAuth, {
    manual: true,
    onSuccess: (res) => {
      setPost(res.data as IPost)
    },
    onError: (err: Error | AxiosError) => {
      handleError(err)
    }
  })

  useEffect(() => {
    id && Number.isInteger(parseInt(id)) && fetchPost(parseInt(id))
  }, [fetchPost, id])

  return (
    <div className='min-h-screen bg-secondary p-2'>
      <div className='container max-w-[1024px]'>
        <div className='bg-white p-4 rounded-md'>
          <h1 className='text-2xl md:text-3xl font-bold'>{post?.title}</h1>
          <p className='text-sm text-muted-foreground'>{moment(post?.createdAt).format('DD/MM/YYYY')}</p>
          <div className='mt-4' dangerouslySetInnerHTML={{ __html: post?.content as string }} />
        </div>

        {post?.questions && <AnswerForm postId={post.id} questions={post?.questions} />}
      </div>
    </div>
  )
}
