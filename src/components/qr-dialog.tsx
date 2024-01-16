import QRCode from 'react-qr-code'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { IPost } from '@/constants/types'
import { PDFDownloadLink } from '@react-pdf/renderer'

import { Button } from './ui/button'
import PDFTemplate from '@/modules/dashboard/components/pdf-template'

export default function QRDialog({
  btnText = 'QR Code',
  post,
  print = true
}: {
  btnText?: string
  post: IPost
  print: boolean
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{btnText}</Button>
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
        {print && (
          <div className='text-right'>
            <Button asChild>
              {post && (
                <PDFDownloadLink document={<PDFTemplate post={post} />} fileName='announcement.pdf'>
                  In
                </PDFDownloadLink>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
