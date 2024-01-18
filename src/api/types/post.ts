export interface CreatePostDTO {
  title: string
  content: string
  questions: CreateQuestionDTO[]
}

export interface EditPostDTO {
  title: string
  content: string
  questions: Array<{
    questionId: number
    title: string
    type: 'single' | 'multiple'
    answers: Array<{
      answerId: number
      title: string
      deleted: boolean
    }>
    deleted: boolean
  }>
}

export interface CreateQuestionDTO {
  title: string
  type: 'single' | 'multiple'
  answers: CreateAnswerDTO[]
}

export interface CreateAnswerDTO {
  title: string
}

export interface SubmitAnswerDTO {
  questions: Array<{
    questionId: number
    answers: Array<{
      answerId: number
    }>
  }>
  comment?: string
  phone?: string
}
