import postService from '@/api/post'
import { IPost } from '@/constants/types'
import { handleError } from '@/utils/helpers'
import { useRequest } from 'ahooks'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import clsx from 'clsx'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function QuestionDetail() {
  const { id } = useParams()

  const [post, setPost] = useState<IPost>()

  const [answers, setAnswer] = useState<Record<number, number[]>>({})

  const { runAsync: fetchPost } = useRequest(postService.getPostByIdWithoutAuth, {
    manual: true,
    onSuccess: (res) => {
      console.log(res)
      setPost(res.data as IPost)
    },
    onError: (err: Error | AxiosError) => {
      handleError(err)
    }
  })

  // const { runAsync: submitAnswer, loading: isSubmitting } = useRequest(postService.submitAnswer, {
  //   manual: true,
  //   onSuccess: (res) => {
  //     console.log(res)
  //     setPost(res.data as IPost)
  //   },
  //   onError: (err: Error | AxiosError) => {
  //     handleError(err)
  //   }
  // })

  useEffect(() => {
    id && Number.isInteger(parseInt(id)) && fetchPost(parseInt(id))
  }, [fetchPost, id])

  const handleClickAnswer = (qId: number, aId: number) => {
    console.log('click')
    const _question = post?.questions?.find((x) => x.id === qId)
    if (!_question) return
    if (_question.type === 'single') {
      setAnswer((prev) => ({ ...prev, [qId]: [aId] }))
    }
    if (_question.type === 'multiple') {
      setAnswer((prev) => {
        const _ans = prev[qId] || []

        return { ...prev, [qId]: _ans.includes(aId) ? _ans.filter((x) => x === aId) : [..._ans, aId] }
      })
    }
  }
  console.log(answers)

  // const handleSubmit = async () => {
  //   if (post && !isSubmitting) {
  //     await submitAnswer(post.id, {
  //       questions: Object.keys(answers).map((ele) => {
  //         return
  //       })
  //     })
  //   }
  // }

  return (
    <div className='min-h-screen bg-secondary p-2'>
      <div className='bg-white p-4 rounded-md'>
        <h1 className='text-2xl md:text-3xl font-bold'>{post?.title}</h1>
        <p className='text-sm text-muted-foreground'>{moment(post?.createdAt).format('DD/MM/YYYY')}</p>
      </div>
      <div className='bg-white p-4 rounded-md mt-4'>
        <h2 className='text-2xl md:text-3xl font-bold'>Bảng khảo sát</h2>
        <div className='flex flex-col mt-2 gap-y-8'>
          {post?.questions?.map((q, index) => (
            <div key={q.id}>
              <h3 className='font-semibold italic mb-2'>
                Câu hỏi {index + 1}: {q.title}
              </h3>

              <div className='flex flex-col gap-y-4'>
                {q.answers?.map((a) => (
                  <div
                    key={a.id}
                    className={clsx(
                      'border-2 rounded p-2 cursor-pointer hover:border-primary',
                      answers[q.id] && answers[q.id].includes(a.id) ? 'border-primary' : 'bg-secondary'
                    )}
                    onClick={() => handleClickAnswer(q.id, a.id)}
                  >
                    {a.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className='mt-8'>
          <h3 className='text-lg font-semibold'>Bình luận:</h3>
          <Textarea
            className='focus:outline-none ring-0 focus:ring-0'
            placeholder='Mong quý khách đóng góp ý kiến...'
            rows={5}
          />
        </div>

        <div className='mt-8 text-center'>
          <Button className='min-w-20' onClick={() => {}}>
            Gửi
          </Button>
        </div>
      </div>
    </div>
  )
}
