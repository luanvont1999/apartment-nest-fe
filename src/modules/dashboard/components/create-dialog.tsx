import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

export default function DashboardCreate() {
  const [isQuestion, setIsQuestion] = useState(false)
  const [form, setForm] = useState({
    title: '',
    content: ''
  })
  return (
    <div>
      <div className='flex gap-x-4'>
        <div className='w-[500px] flex flex-col gap-y-2'>
          <Switch checked={isQuestion} onCheckedChange={setIsQuestion} />
          <label className=''>
            <span className='text-sm pl-2 text-slate-400'>Tiêu đề</span>
            <Textarea placeholder='Nhập tiêu đề bài viết' />
          </label>
          <label className='Nội dung'>
            <span className='text-sm pl-2 text-slate-400'>Tiêu đề</span>
            <Textarea placeholder='Nhập nội dung bài viết' />
          </label>
        </div>
        {isQuestion && (
          <div className='w-[500px]'>
            <label className=''>
              <span className='text-sm pl-2 text-slate-400'>Câu hỏi</span>
              <Textarea placeholder='Câu hỏi của bạn' />
            </label>
          </div>
        )}
      </div>
    </div>
  )
}
