import postService from '@/api/post'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IPost } from '@/constants/types'
import { handleError } from '@/utils/helpers'
import { useRequest } from 'ahooks'
import { AxiosError } from 'axios'
import { ChevronLeft, Minus, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TextEditor from './components/text-editor'
import { Switch } from '@/components/ui/switch'
import clsx from 'clsx'

type FormEditDTO = {
  title: string
  content: string
}

type QuestionEditDTO = Array<{
  questionId?: number
  title: string
  type: 'single' | 'multiple'
  answers: Array<{
    answerId?: number
    title: string
    deleted: boolean
  }>
  deleted: boolean
}>

export default function DashboardEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [post, setPost] = useState<IPost>()
  const [form, setForm] = useState<FormEditDTO>({
    title: '',
    content: ''
  })
  const [questions, setQuestions] = useState<QuestionEditDTO>([])

  const resetForm = () => {
    if (!post) return
    setQuestions(
      post.questions.map((q) => ({
        questionId: q.id,
        title: q.title,
        type: q.type,
        deleted: false,
        answers:
          q.answers?.map((a) => ({
            answerId: a.id,
            title: a.title,
            deleted: false
          })) || []
      }))
    )
  }

  const { runAsync: fetchPost } = useRequest(postService.getPost, {
    manual: true,
    onSuccess: (res) => {
      const { data } = res
      setPost(data)
      setForm({
        title: data.title,
        content: data.content
      })
      resetForm()
    },
    onError: (err: Error | AxiosError) => {
      handleError(err)
    }
  })

  const { runAsync: onSubmit, loading: isLoading } = useRequest(postService.editPost, {
    manual: true,
    onSuccess: () => {
      navigate(`/dashboard/${id}`, { replace: true })
    },
    onError: (err: Error | AxiosError) => {
      handleError(err)
    }
  })

  useEffect(() => {
    id && parseInt(id) && fetchPost(parseInt(id))
  }, [fetchPost, id])

  useEffect(() => {
    post && resetForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post])

  const handleChangeForm = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, name } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, { title: '', type: 'single', answers: [], deleted: false }])
  }

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => {
      prev.splice(index, 1)
      return [...prev]
    })
  }

  const handleToggleDeleteQuestion = (index: number) => {
    setQuestions((prev) => {
      prev[index].deleted = !prev[index].deleted
      return [...prev]
    })
  }

  const handleChangeQuestion = (qIndex: number, value: string) => {
    setQuestions((prev) => {
      const _q = prev[qIndex]
      _q.title = value
      return [...prev]
    })
  }

  const handleChangeQuestionType = (qIndex: number) => (value: boolean) => {
    setQuestions((prev) => {
      const _q = prev[qIndex]
      _q.type = value ? 'multiple' : 'single'
      return [...prev]
    })
  }

  const handleAddAnswer = (qIndex: number) => {
    setQuestions((prev) => {
      const _q = prev[qIndex]
      _q.answers.push({ title: '', deleted: false })
      return [...prev]
    })
  }

  const handleChangeAnswer = (qIndex: number, aIndex: number, value: string) => {
    setQuestions((prev) => {
      const _q = prev[qIndex]
      _q.answers[aIndex].title = value
      return [...prev]
    })
  }

  const handleRemoveAnswer = (qIndex: number, aIndex: number) => {
    setQuestions((prev) => {
      if (prev[qIndex].answers[aIndex].answerId) {
        prev[qIndex].answers[aIndex].deleted = true
      } else {
        prev[qIndex].answers.splice(aIndex, 1)
      }
      return [...prev]
    })
  }

  const handleSubmit = async () => {
    if (!isLoading && id) {
      const formattedQuestion =
        questions.map((q) => ({
          ...q,
          questionId: q.questionId || new Date().getTime(),
          answers:
            q.answers.map((ans) => ({
              ...ans,
              answerId: ans.answerId || new Date().getTime()
            })) || []
        })) || []
      await onSubmit(parseInt(id), { ...form, questions: formattedQuestion })
    }
  }

  return (
    <div>
      <div className='flex justify-between mb-6'>
        <Button variant='ghost' onClick={() => navigate(-1)}>
          <ChevronLeft className='mr-2' />
          <span>Trở về</span>
        </Button>

        <div className='flex gap-x-2'>
          <Button className='text-md font-medium' onClick={resetForm}>
            Phục hồi
          </Button>

          <Button className='text-md font-medium' onClick={handleSubmit}>
            Lưu
          </Button>
        </div>
      </div>

      <div className='flex flex-col gap-y-4 mb-6 border p-4 rounded-md shadow bg-white'>
        <Label>
          <span className='text-xl pl-2'>Tiêu đề</span>
          <Input
            className='mt-2 rounded'
            name='title'
            placeholder='Nhập tiêu đề'
            value={form.title}
            onChange={handleChangeForm}
          />
        </Label>

        <div>
          <span className='text-xl pl-2 mb-2'>Nội dung</span>
          {form.content && (
            <TextEditor value={form.content} setValue={(value) => setForm((prev) => ({ ...prev, content: value }))} />
          )}
        </div>
      </div>

      <div className='flex flex-col'>
        <div className='flex flex-col mt-4 gap-y-8'>
          {questions.map((q, index) => (
            <div
              key={index}
              className={clsx('rounded-md shadow p-4 border', q.deleted ? 'bg-destructive/10' : 'bg-white')}
            >
              <div className='flex justify-between items-center'>
                <p className='text-base'>Câu hỏi {index + 1}</p>

                <div className='flex gap-x-2'>
                  {q.questionId ? (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='px-2 py-1'
                      onClick={() => handleToggleDeleteQuestion(index)}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  ) : (
                    index !== 0 && (
                      <Button
                        variant='ghost'
                        size='sm'
                        className='px-2 py-1'
                        onClick={() => handleRemoveQuestion(index)}
                      >
                        <X className='w-4 h-4' />
                      </Button>
                    )
                  )}
                </div>
              </div>
              <Label>
                <Input
                  className='mt-2 rounded'
                  placeholder='Nội dung câu hỏi'
                  value={q.title}
                  disabled={q.deleted}
                  onChange={(event) => handleChangeQuestion(index, event.target.value)}
                />
              </Label>

              <div className='flex justify-between items-center mt-4'>
                <div className='flex items-center gap-x-2'>
                  <p className='text-base'>Bảng câu trả lời</p>
                  <Button disabled={q.deleted} variant='ghost' size='icon' onClick={() => handleAddAnswer(index)}>
                    <Plus className='w-4 h-4 cursor-pointer' />
                  </Button>
                </div>
                <Label className='flex items-center gap-x-2'>
                  <span>Chọn nhiều</span>
                  <Switch
                    checked={q.type === 'multiple'}
                    onCheckedChange={handleChangeQuestionType(index)}
                    disabled={q.deleted}
                  />
                </Label>
              </div>
              <div className='flex flex-col gap-y-3 mt-2'>
                {q.answers
                  .filter((ans) => !ans.deleted)
                  .map((ans, aIndex) => (
                    <div className='flex gap-x-2' key={aIndex}>
                      <div className='flex-1'>
                        <Input
                          value={ans.title}
                          className='rounded'
                          placeholder={`Câu trả lời ${aIndex + 1}`}
                          disabled={q.deleted}
                          onChange={(event) => handleChangeAnswer(index, aIndex, event.target.value)}
                        />
                      </div>
                      <Button
                        disabled={q.deleted}
                        variant='ghost'
                        size='icon'
                        onClick={() => handleRemoveAnswer(index, aIndex)}
                      >
                        <Minus className='w-4 h-4' />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          ))}

          <Button size='icon' className='self-center mt-8' onClick={handleAddQuestion}>
            <Plus />
          </Button>
        </div>
      </div>
    </div>
  )
}
