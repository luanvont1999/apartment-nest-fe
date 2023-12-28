import postService from '@/api/post'
import Pagination from '@/components/pagination'
import { IComment, ListPagination } from '@/constants/types'
import { handleError } from '@/utils/helpers'
import { useRequest } from 'ahooks'
import { AxiosError } from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'

export default function ListComment({ postId }: { postId: number }) {
  const [comments, setComments] = useState<ListPagination<IComment>>()

  const { runAsync: fetchComments } = useRequest(postService.getPostComments, {
    manual: true,
    onSuccess: (res) => {
      setComments(res.data as ListPagination<IComment>)
    },
    onError: (err: Error | AxiosError) => {
      handleError(err)
    }
  })

  useEffect(() => {
    postId && fetchComments({ postId })
  }, [fetchComments, postId])

  const handleChangePage = (value: number) => {
    fetchComments({ postId, page: value, perPage: comments?.perPage || 10 })
  }

  return (
    <div>
      <div className='flex flex-col gap-y-2'>
        {comments?.data.map((cmt) => (
          <div key={cmt.id} className='border p-2 rounded-md'>
            <p className='text-sm text-muted-foreground mb-2'>
              {moment(cmt.createdAt).format('HH:mm:ss [ngày] DD/MM/YYYY')}
            </p>
            <p>{cmt.content}</p>
          </div>
        ))}
      </div>
      {comments && <Pagination {...comments} className='mt-4' onChange={handleChangePage} />}
    </div>
  )
}
