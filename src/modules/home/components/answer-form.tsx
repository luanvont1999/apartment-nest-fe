import postService from '@/api/post'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { IQuestion } from '@/constants/types'
import { handleError } from '@/utils/helpers'
import { Label } from '@radix-ui/react-label'
import { useRequest } from 'ahooks'
import { AxiosError } from 'axios'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AnswerForm({ postId, questions }: { postId: number; questions: IQuestion[] }) {
  const navigate = useNavigate()
  const [answers, setAnswer] = useState<Record<number, number[]>>({})
  const [comment, setComment] = useState('')
  const [phone, setPhone] = useState('')

  const { runAsync: submitAnswer, loading: isSubmitting } = useRequest(postService.submitAnswer, {
    manual: true,
    onSuccess: () => {
      navigate('/success')
    },
    onError: (err: Error | AxiosError) => {
      handleError(err)
    }
  })

  const handleClickAnswer = (qId: number, aId: number) => {
    const _question = questions?.find((x) => x.id === qId)
    if (!_question) return
    if (_question.type === 'single') {
      setAnswer((prev) => ({ ...prev, [qId]: [aId] }))
    }
    if (_question.type === 'multiple') {
      setAnswer((prev) => {
        const _ans = prev[qId] || []

        return { ...prev, [qId]: _ans.includes(aId) ? _ans.filter((x) => x !== aId) : [..._ans, aId] }
      })
    }
  }

  const handleSubmit = async () => {
    if (!isSubmitting) {
      await submitAnswer(postId, {
        questions: Object.entries(answers).map(([key, value]) => {
          return { questionId: parseInt(key), answers: value.map((x) => ({ answerId: x })) }
        }),
        comment: comment ? comment : undefined,
        phone: phone ? phone : undefined
      })
    }
  }

  return (
    <div className='bg-white p-4 rounded-md mt-4'>
      <h2 className='text-2xl md:text-3xl font-bold'>Bảng khảo sát</h2>
      <div className='flex flex-col mt-2 gap-y-8'>
        {questions?.map((q, index) => (
          <div key={q.id}>
            <h3 className='font-semibold italic mb-2'>
              Câu hỏi {index + 1}: {q.title}
            </h3>

            <RadioGroup className='flex flex-col gap-y-4'>
              {q.answers?.map((a) => (
                <div className='flex gap-x-2 items-center' key={a.id}>
                  {q.type === 'single' ? (
                    <RadioGroupItem
                      checked={answers[q.id] && answers[q.id].includes(a.id)}
                      value={`${a.id}`}
                      onClick={() => handleClickAnswer(q.id, a.id)}
                    />
                  ) : (
                    <Checkbox
                      checked={answers[q.id] && answers[q.id].includes(a.id)}
                      onClick={() => handleClickAnswer(q.id, a.id)}
                    />
                  )}
                  <div
                    key={a.id}
                    className={clsx(
                      'border-2 rounded p-2 px-4 cursor-pointer hover:border-primary flex-1',
                      answers[q.id] && answers[q.id].includes(a.id) ? 'border-primary' : 'bg-secondary'
                    )}
                    onClick={() => handleClickAnswer(q.id, a.id)}
                  >
                    {a.title}
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>

      <div className='mt-8'>
        <h3 className='text-lg font-semibold mb-1'>Bình luận:</h3>
        <Textarea
          className='focus:outline-none ring-0 focus:ring-0 mb-4'
          placeholder='Mong quý khách đóng góp ý kiến...'
          rows={5}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />

        <Label className='mt-8'>
          <span className='text-sm mb-2 italic'>Số điện thoại (không bắt buộc): </span>
          <Input type='phone' onChange={(event) => setPhone(event.target.value)} className='mt-1' />
        </Label>
      </div>

      <div className='mt-8 text-center'>
        <Button disabled={isSubmitting} className='min-w-20' onClick={handleSubmit}>
          {isSubmitting && <Loader2 className='animate-spin mr-2' />}
          Gửi
        </Button>
      </div>
    </div>
  )
}
