import postService from '@/api/post'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { handleError } from '@/utils/helpers'
import { useRequest } from 'ahooks'
import { AxiosError } from 'axios'
import { Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const DEFAULT_QUESTION: { title: string; type: 'single' | 'multiple'; answers: { title: string }[] } = {
  title: '',
  type: 'single',
  answers: [
    {
      title: 'Câu trả lời 1'
    },
    {
      title: 'Câu trả lời 2'
    }
  ]
}

export default function DashboardCreate() {
  const [isQuestion, setIsQuestion] = useState(false)
  const [form, setForm] = useState({
    title: '',
    content: ''
  })

  const [questions, setQuestions] = useState<
    { title: string; type: 'multiple' | 'single'; answers: { title: string }[] }[]
  >([])

  const { runAsync: onSubmit, loading: isLoading } = useRequest(postService.setPost, {
    manual: true,
    onSuccess: (res) => {
      console.log(res)
    },
    onError: (err: Error | AxiosError) => {
      handleError(err)
    }
  })

  useEffect(() => {
    if (isQuestion && questions.length === 0) {
      setQuestions([DEFAULT_QUESTION])
    }
  }, [isQuestion, questions])

  const handleChangeForm = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, name } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, DEFAULT_QUESTION])
  }

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => {
      prev.splice(index, index)
      console.log(prev)
      return prev
    })
  }

  const handleChangeQuestion = (qIndex: number, value: string) => {
    setQuestions((prev) => {
      const _q = prev[qIndex]
      _q.title = value
      return prev
    })
  }

  const handleChangeQuestionType = (qIndex: number) => (value: boolean) => {
    console.log(qIndex, value)
    setQuestions((prev) => {
      const _q = prev[qIndex]
      _q.type = value ? 'multiple' : 'single'
      return [...prev]
    })
  }

  const handleAddAnswer = (qIndex: number) => {
    setQuestions((prev) => {
      const _q = prev[qIndex]
      _q.answers.push({ title: '' })
      return [...prev]
    })
  }

  const handleChangeAnswer = (qIndex: number, aIndex: number, value: string) => {
    setQuestions((prev) => {
      const _q = prev[qIndex]
      _q.answers[aIndex].title = value
      return prev
    })
  }

  const handleSubmit = async () => {
    if (!isLoading) {
      await onSubmit({ ...form, questions: isQuestion ? questions : [] })
    }
  }

  return (
    <div className='flex flex-col'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-semibold'>Tạo bài viết</h2>
        <Button className='text-md font-medium' onClick={handleSubmit}>
          Lưu
        </Button>
      </div>
      <div className='flex flex-col gap-y-4 mb-6 border p-4 rounded-md shadow'>
        <Label>
          <span className='text-xl pl-2'>Tiêu đề</span>
          <Input className='mt-2 rounded' name='title' placeholder='Nhập tiêu đề' onChange={handleChangeForm} />
        </Label>

        <Label>
          <span className='pl-2'>Nội dung</span>
          <Textarea
            className='mt-2 rounded'
            name='content'
            placeholder='Nhập nội dung'
            rows={5}
            onChange={handleChangeForm}
          />
        </Label>
      </div>

      <div className='flex flex-col'>
        <Label className='flex items-center gap-x-4'>
          <Switch checked={isQuestion} onCheckedChange={setIsQuestion} />
          <span className='text-xl'>Tạo câu hỏi khảo sát</span>
        </Label>

        {isQuestion && (
          <div className='flex flex-col mt-4 gap-y-8'>
            {questions.map((q, index) => (
              <div key={index} className='rounded-md shadow p-4 border'>
                <Label>
                  <div className='flex justify-between items-center'>
                    <p className='text-base'>Câu hỏi {index + 1}</p>

                    <div className='flex gap-x-2'>
                      {index !== 0 && (
                        <Button
                          variant='ghost'
                          size='sm'
                          className='px-2 py-1'
                          onClick={() => handleRemoveQuestion(index)}
                        >
                          <X className='w-4 h-4' />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Input
                    className='mt-2 rounded'
                    placeholder='Nội dung câu hỏi'
                    onChange={(event) => handleChangeQuestion(index, event.target.value)}
                  />
                </Label>

                <div className='flex justify-between items-center mt-4'>
                  <div className='flex items-center gap-x-2'>
                    <p className='text-base'>Bảng câu trả lời</p>
                    <Plus className='w-4 h-4 cursor-pointer' onClick={() => handleAddAnswer(index)} />
                  </div>
                  <Label className='flex items-center gap-x-2'>
                    <span>Chọn nhiều</span>
                    <Switch checked={q.type === 'multiple'} onCheckedChange={handleChangeQuestionType(index)} />
                  </Label>
                </div>
                <div className='flex flex-col gap-y-3 mt-2'>
                  {q.answers.map((ans, aIndex) => (
                    <div key={aIndex}>
                      <Input
                        value={ans.title}
                        className='rounded'
                        placeholder='Nội dung câu trả lời'
                        onChange={(event) => handleChangeAnswer(index, aIndex, event.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Button size='icon' className='self-center mt-8' onClick={handleAddQuestion}>
              <Plus />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
