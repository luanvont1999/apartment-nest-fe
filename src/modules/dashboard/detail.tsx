import { useRequest } from 'ahooks'
import { AxiosError } from 'axios'
import { ChevronLeft } from 'lucide-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import postService from '@/api/post'
import { Button } from '@/components/ui/button'
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import QRCode from 'react-qr-code'
import { IPost } from '@/constants/types'
import { handleError } from '@/utils/helpers'

import ListComment from './components/list-comment'
import ListQuestion from './components/list-question'
import { ENV } from '@/constants'
import { PDFDownloadLink } from '@react-pdf/renderer'
import PDFTemplate from './components/pdf-template'

export default function DashboardDetail() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [post, setPost] = useState<IPost>()

  const { runAsync: fetchPost } = useRequest(postService.getPost, {
    manual: true,
    onSuccess: (res) => {
      console.log(res)
      setPost(res.data as IPost)
    },
    onError: (err: Error | AxiosError) => {
      handleError(err)
    }
  })

  useEffect(() => {
    id && parseInt(id) && fetchPost(parseInt(id))
  }, [fetchPost, id])

  return (
    <div>
      <div className='flex justify-between mb-4'>
        <Button variant='ghost' onClick={() => navigate(-1)}>
          <ChevronLeft className='mr-2' />
          <span>Trở về</span>
        </Button>

        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Tạo PDF</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{post?.title}</DialogTitle>
              </DialogHeader>
              <div className=''>{post?.content}</div>
              <div className='flex justify-center'>
                <QRCode value={`${ENV.websiteUrl}/question/${post?.id}`} size={160} />
              </div>
              <div className='text-right'>
                <Button asChild>
                  {post && (
                    <PDFDownloadLink document={<PDFTemplate post={post} />} fileName='fee_acceptance.pdf'>
                      In
                    </PDFDownloadLink>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className='bg-white p-4 rounded-md border'>
        <h3 className='text-2xl font-bold'>Bài viết: {post?.title}</h3>
        <p className='text-muted-foreground text-sm mb-4'>Ngày đăng: {moment(post?.createdAt).format('DD/MM/YYYY')}</p>
        <p>{post?.content}</p>
      </div>

      <div className='bg-white p-4 rounded-md border mt-4'>
        <h3 className='text-2xl font-bold mb-4'>Thống kê phản hồi</h3>
        {post && <ListQuestion questions={post.questions} />}
      </div>

      <div className='bg-white p-4 rounded-md border mt-4'>
        <h3 className='text-2xl font-bold mb-4'>Lượt bình luận</h3>
        {post && <ListComment postId={post?.id} />}
      </div>
    </div>
  )
}
