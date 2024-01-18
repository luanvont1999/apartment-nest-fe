import { useRequest } from 'ahooks'
import { AxiosError } from 'axios'
import { ChevronLeft } from 'lucide-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { useNavigate, useParams } from 'react-router-dom'

import postService from '@/api/post'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { IPost } from '@/constants/types'
import { handleError } from '@/utils/helpers'
import { PDFDownloadLink } from '@react-pdf/renderer'

import ListComment from './components/list-comment'
import ListQuestion from './components/list-question'
import PDFTemplate from './components/pdf-template'

export default function DashboardDetail() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [post, setPost] = useState<IPost>()

  const { runAsync: fetchPost } = useRequest(postService.getPost, {
    manual: true,
    onSuccess: (res) => {
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

        <div className='flex gap-x-4'>
          <Button
            onClick={() => {
              const url = `${location.origin}/question/${id}`
              navigator.clipboard.writeText(url).then(() => {
                alert(`Đã sao chép vào bộ nhớ tạm`)
              })
            }}
          >
            Copy Link
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>QR Code</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  <p className='text-center'>{post?.title}</p>
                </DialogTitle>
              </DialogHeader>
              <div className='flex flex-col items-center'>
                <QRCode value={`${location.origin}/question/${post?.id}`} size={160} />
                <p className='mt-2'>Quét QRCode để chia sẻ ý kiến của bạn</p>
              </div>
              <div className='text-right'>
                <Button asChild>
                  {post && (
                    <PDFDownloadLink document={<PDFTemplate post={post} />} fileName='announcement.pdf'>
                      In
                    </PDFDownloadLink>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={() => navigate('./edit')}>Chỉnh sửa</Button>
        </div>
      </div>
      <div className='bg-white p-4 rounded-md border'>
        <h3 className='text-2xl font-bold'>Ý kiến: {post?.title}</h3>
        <p className='text-muted-foreground text-sm mb-4'>Ngày đăng: {moment(post?.createdAt).format('DD/MM/YYYY')}</p>
        <div dangerouslySetInnerHTML={{ __html: post?.content as string }} />
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
