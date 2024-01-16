import postService from '@/api/post'
import Pagination from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { IComment, ListPagination } from '@/constants/types'
import { handleError } from '@/utils/helpers'
import { useRequest } from 'ahooks'
import { AxiosError } from 'axios'
import { X } from 'lucide-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

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

  const { runAsync: onDelete } = useRequest(postService.deleteComment, {
    manual: true,
    onSuccess: () => {
      fetchComments({ postId, page: 1, perPage: comments?.perPage || 10 })
      toast('Xoá thành công')
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
          <div key={cmt.id} className='border p-2 rounded-md relative'>
            <p className='text-sm text-muted-foreground mb-2'>
              <b>{cmt.phone}</b> - {moment(cmt.createdAt).format('HH:mm:ss [ngày] DD/MM/YYYY')}
            </p>
            <p>{cmt.content}</p>
            <Button
              variant='ghost'
              className='absolute right-2 top-2 px-2 py-2 h-8 hover:text-destructive'
              onClick={() => onDelete(cmt.id)}
            >
              <X className='w-4 h-4' />
            </Button>
          </div>
        ))}
      </div>
      {comments && <Pagination {...comments} className='mt-4' onChange={handleChangePage} />}
    </div>
  )
}
