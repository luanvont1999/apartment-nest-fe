export interface CreatePostDTO {
  title: string
  content: string
  questions: CreateQuestionDTO[]
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
  comment: string
}
