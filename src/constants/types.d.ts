export interface ListPagination<T> {
  data: Array<T>
  total: number
  page: number
  perPage: number
}

export interface IPost {
  id: number
  title: string
  content: string
  status: 'active' | 'inactive'

  questions: IQuestion[]

  createdAt: string
  updatedAt: string
}

export interface IQuestion {
  id: number
  title: string
  type: 'single' | 'multiple'
  status: 'active' | 'inactive'

  answers?: IAnswer[]
  postId?: number

  createdAt: string
  updatedAt: string
}

export interface IAnswer {
  id: number
  title: string
  count: number
  status: 'active' | 'inactive'

  questionId?: number

  createdAt: string
  updatedAt: string
}

export interface IComment {
  id: number
  content: string
  status: 'active' | 'inactive'

  postId: number

  createdAt: string
  updatedAt: string
}
